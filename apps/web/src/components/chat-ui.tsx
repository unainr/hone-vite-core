import { useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
	DefaultChatTransport,
	isToolUIPart,
	type DynamicToolUIPart,
	type ToolUIPart,
} from "ai";
import { useAuth } from "@clerk/react";
import {
	ArrowUpIcon,
	SparklesIcon,
	SquareIcon,
	WrenchIcon,
} from "lucide-react";
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerItem,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block";
import {
	Trace,
	TraceCollapsible,
	TraceCollapsibleContent,
	TraceCollapsibleTrigger,
	TraceIcon,
	TraceLine,
	TraceTitle,
} from "@/components/ui/trace";

type ToolPart = ToolUIPart | DynamicToolUIPart;

const toText = (value: unknown) =>
	typeof value === "string" ? value : JSON.stringify(value, null, 2);

const getToolName = (part: ToolPart) =>
	part.type === "dynamic-tool"
		? part.toolName
		: part.type.replace(/^tool-/, "");

function ToolLine({ part, streaming }: { part: ToolPart; streaming: boolean }) {
	const name = getToolName(part);

	if (part.state === "output-denied") {
		return (
			<TraceLine>
				<TraceIcon>
					<WrenchIcon />
				</TraceIcon>
				<TraceTitle>Denied {name}</TraceTitle>
			</TraceLine>
		);
	}

	if (part.state === "output-available" || part.state === "output-error") {
		const failed = part.state === "output-error";

		return (
			<TraceCollapsible defaultOpen={failed}>
				<TraceCollapsibleTrigger>
					<TraceLine status={failed ? "error" : undefined}>
						<TraceIcon>
							<WrenchIcon />
						</TraceIcon>
						<TraceTitle>
							{failed ? "Failed to run" : "Ran"} {name}
						</TraceTitle>
					</TraceLine>
				</TraceCollapsibleTrigger>
				<TraceCollapsibleContent>
					<div className="flex flex-col gap-2">
						{part.input !== undefined && (
							<CodeBlock size="sm">
								<CodeBlockContent wrap className="max-h-48">
									{toText(part.input)}
								</CodeBlockContent>
							</CodeBlock>
						)}
						<CodeBlock size="sm">
							<CodeBlockContent wrap className="max-h-64">
								{failed ? part.errorText : toText(part.output)}
							</CodeBlockContent>
						</CodeBlock>
					</div>
				</TraceCollapsibleContent>
			</TraceCollapsible>
		);
	}

	// input-streaming / input-available
	return (
		<TraceLine status={streaming ? "running" : "error"}>
			<TraceIcon>
				<WrenchIcon />
			</TraceIcon>
			<TraceTitle>
				{streaming ? "Running" : "Failed to run"} {name}
			</TraceTitle>
		</TraceLine>
	);
}

export function Chat() {
	const { getToken } = useAuth();
	const [text, setText] = useState("");
	const formRef = useRef<HTMLFormElement>(null);

	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: `${import.meta.env.VITE_API_URL}/api/chat`,
				headers: async (): Promise<Record<string, string>> => {
					const token = await getToken();
					return token ? { Authorization: `Bearer ${token}` } : {};
				},
			}),
		[getToken],
	);

	const { messages, sendMessage, status, stop, error } = useChat({ transport });
	const busy = status === "submitted" || status === "streaming";

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const value = text.trim();
		if (!value || busy) return;
		sendMessage({ text: value });
		setText("");
	};

	return (
		<div className="mx-auto flex h-dvh w-full max-w-3xl flex-col px-4 pb-4">
			<MessageScrollerProvider autoScroll>
				<MessageScroller className="flex-1">
					<MessageScrollerViewport className="scrollbar-thin [scrollbar-color:rgb(63_63_70)_transparent]">
						<MessageScrollerContent className="flex flex-col gap-6 py-6">
							{messages.length === 0 && (
								<div className="flex min-h-[55vh] flex-col items-center justify-center gap-5 text-center">
									<div className="rounded-2xl bg-violet-500/10 p-3">
										<SparklesIcon className="size-6 text-violet-500" />
									</div>
									<div className="space-y-1">
										<h1 className="text-2xl font-semibold tracking-tight">
											How can I help you today?
										</h1>
										<p className="text-sm text-muted-foreground">
											Ask anything to get started.
										</p>
									</div>
								</div>
							)}

							{messages.map((message) => {
								const isUser = message.role === "user";
								return (
									<MessageScrollerItem
										key={message.id}
										messageId={message.id}
										scrollAnchor={isUser}>
										<Message align={isUser ? "end" : "start"}>
											<MessageContent>
												{message.parts.map((part, i) => {
													const key = `${message.id}-${i}`;

													if (part.type === "text") {
														return isUser ? (
															<Bubble key={key} align="end" variant="default">
																<BubbleContent className="bg-violet-600 text-white">
																	{part.text}
																</BubbleContent>
															</Bubble>
														) : (
															<div key={key} className="whitespace-pre-wrap">
																{part.text}
															</div>
														);
													}

													if (isToolUIPart(part)) {
														return (
															<Trace key={key}>
																<ToolLine part={part} streaming={busy} />
															</Trace>
														);
													}

													return null;
												})}
											</MessageContent>
										</Message>
									</MessageScrollerItem>
								);
							})}

							{status === "submitted" && (
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<Spinner /> Thinking...
								</div>
							)}

							{error && (
								<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
									{error.message || "Something went wrong. Please try again."}
								</div>
							)}
						</MessageScrollerContent>
					</MessageScrollerViewport>
					<MessageScrollerButton />
				</MessageScroller>
			</MessageScrollerProvider>

			<form ref={formRef} onSubmit={onSubmit} className="mt-2">
				<InputGroup className="rounded-2xl focus-within:border-violet-500/60">
					<InputGroupTextarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Message the assistant..."
						className="p-3"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								formRef.current?.requestSubmit();
							}
						}}
					/>
					<InputGroupAddon align="block-end">
						{busy ? (
							<InputGroupButton
								type="button"
								size="icon-sm"
								variant="default"
								className="ml-auto rounded-full bg-violet-600 text-white hover:bg-violet-500"
								aria-label="Stop"
								onClick={stop}>
								<SquareIcon />
							</InputGroupButton>
						) : (
							<InputGroupButton
								type="submit"
								size="icon-sm"
								variant="default"
								className="ml-auto rounded-full bg-violet-600 text-white hover:bg-violet-500"
								disabled={!text.trim()}
								aria-label="Send">
								<ArrowUpIcon />
							</InputGroupButton>
						)}
					</InputGroupAddon>
				</InputGroup>
			</form>
		</div>
	);
}
