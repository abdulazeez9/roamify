import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { postKeys } from './query-keys';
import { notify } from '@/lib/toast';

// ============================================
// POST QUERIES
// ============================================

export function usePosts(filters?: any) {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => apiRequest(API_ENDPOINTS.POSTS.LIST),
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => apiRequest(API_ENDPOINTS.POSTS.BY_ID(id)),
    enabled: !!id,
  });
}

export function useMyPosts() {
  return useQuery({
    queryKey: postKeys.myPosts(),
    queryFn: () => apiRequest(API_ENDPOINTS.POSTS.MY_POSTS),
  });
}

export function useFeed() {
  return useQuery({
    queryKey: postKeys.feed(),
    queryFn: () => apiRequest(API_ENDPOINTS.POSTS.FEED),
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: postKeys.comments(postId),
    queryFn: () => apiRequest(API_ENDPOINTS.POSTS.COMMENTS.LIST(postId)),
    enabled: !!postId,
  });
}

// ============================================
// POST MUTATIONS
// ============================================

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      return apiRequest(API_ENDPOINTS.POSTS.CREATE, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      notify(
        'Post Created',
        'success',
        'Your post has been created successfully',
      );
    },
    onError: (error: any) => {
      notify('Creation Failed', 'error', 'Failed to create post');
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(API_ENDPOINTS.POSTS.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.detail(id) });
      const previousData = queryClient.getQueryData(postKeys.detail(id));

      queryClient.setQueryData(postKeys.detail(id), (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousData, id };
    },
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      notify('Post Updated', 'success', 'Post updated successfully');
    },
    onError: (error: any, { id }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(postKeys.detail(id), context.previousData);
      }
      notify('Update Failed', 'error', 'Failed to update post');
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest(API_ENDPOINTS.POSTS.DELETE(id), {
        method: 'DELETE',
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: postKeys.lists() });
      const previousData = queryClient.getQueryData(postKeys.lists());

      queryClient.setQueryData(postKeys.lists(), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((post: any) => post.id !== id),
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      queryClient.invalidateQueries({ queryKey: postKeys.myPosts() });
      queryClient.invalidateQueries({ queryKey: postKeys.feed() });
      notify('Post Deleted', 'success', 'Post deleted successfully');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(postKeys.lists(), context.previousData);
      }
      notify('Delete Failed', 'error', 'Failed to delete post');
    },
  });
}

export function useToggleLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      apiRequest(API_ENDPOINTS.POSTS.TOGGLE_LIKE(postId), {
        method: 'POST',
      }),
    onMutate: async (postId) => {
      // Cancel all post list queries
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      // Snapshot all list queries
      const previousQueries = queryClient.getQueriesData({
        queryKey: postKeys.all,
      });

      // Optimistically update ALL post queries (lists, feed, myPosts, etc.)
      queryClient.setQueriesData({ queryKey: postKeys.all }, (old: any) => {
        if (!old?.data) return old;

        // Handle array of posts (list/feed queries)
        if (Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    isLikedByUser: !post.isLikedByUser,
                    _count: {
                      ...post._count,
                      likes: post.isLikedByUser
                        ? post._count.likes - 1
                        : post._count.likes + 1,
                    },
                  }
                : post,
            ),
          };
        }

        // Handle single post (detail query)
        if (old.data?.id === postId) {
          return {
            ...old,
            data: {
              ...old.data,
              isLikedByUser: !old.data.isLikedByUser,
              _count: {
                ...old.data._count,
                likes: old.data.isLikedByUser
                  ? old.data._count.likes - 1
                  : old.data._count.likes + 1,
              },
            },
          };
        }

        return old;
      });

      return { previousQueries };
    },
    onError: (error: any, postId, context) => {
      // Rollback all queries
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useSharePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) =>
      apiRequest(API_ENDPOINTS.POSTS.SHARE(postId), {
        method: 'POST',
      }),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postKeys.all });

      const previousQueries = queryClient.getQueriesData({
        queryKey: postKeys.all,
      });

      // Optimistically update ALL post queries
      queryClient.setQueriesData({ queryKey: postKeys.all }, (old: any) => {
        if (!old?.data) return old;

        // Handle array of posts
        if (Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map((post: any) =>
              post.id === postId
                ? {
                    ...post,
                    isSharedByUser: true,
                    _count: {
                      ...post._count,
                      shares: post._count.shares + 1,
                    },
                  }
                : post,
            ),
          };
        }

        // Handle single post
        if (old.data?.id === postId) {
          return {
            ...old,
            data: {
              ...old.data,
              isSharedByUser: true,
              _count: {
                ...old.data._count,
                shares: old.data._count.shares + 1,
              },
            },
          };
        }

        return old;
      });

      return { previousQueries };
    },
    onSuccess: () => {
      notify('Post Shared', 'success', 'Post shared successfully');
    },
    onError: (error: any, postId, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
// ============================================
// COMMENT MUTATIONS
// ============================================

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: any }) =>
      apiRequest(API_ENDPOINTS.POSTS.COMMENTS.CREATE(postId), {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_result, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      notify('Comment Added', 'success', 'Your comment has been added');
    },
    onError: (error: any) => {
      notify('Comment Failed', 'error', 'Failed to add comment');
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) =>
      apiRequest(API_ENDPOINTS.POSTS.COMMENTS.DELETE(postId, commentId), {
        method: 'DELETE',
      }),
    onMutate: async ({ postId, commentId }) => {
      await queryClient.cancelQueries({ queryKey: postKeys.comments(postId) });
      const previousData = queryClient.getQueryData(postKeys.comments(postId));

      queryClient.setQueryData(postKeys.comments(postId), (old: any) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((comment: any) => comment.id !== commentId),
        };
      });

      return { previousData, postId };
    },
    onSuccess: (_result, { postId }) => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) });
      notify('Comment Deleted', 'success', 'Comment removed successfully');
    },
    onError: (error: any, { postId }, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          postKeys.comments(postId),
          context.previousData,
        );
      }
      notify('Delete Failed', 'error', 'Failed to delete comment');
    },
  });
}
