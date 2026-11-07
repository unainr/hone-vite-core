import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
type ResponseType = InferResponseType<typeof client.api.todo.$post, 201>;
type RequestType = InferRequestType<typeof client.api.todo.$post>["json"];

export const useTodo = () => {
    const queryClient = useQueryClient();
	return useMutation<ResponseType, Error, RequestType>({
		mutationFn: async (json) => {
			const response = await client.api.todo.$post({ json });

			if (!response.ok) {
				throw new Error("Failed to create Todo");
			}

			return await response.json();
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todo"] });
			 // Refresh billing/navbar
      
		},
	});
}