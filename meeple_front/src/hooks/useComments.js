import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useComments = (articleId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://boardjjigae.duckdns.org/api/game-info/community/${articleId}/comments`);
      setComments(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  const addComment = async ({content, gameCommunityId, userId}) => {
    try {
      await axios.post(`https://boardjjigae.duckdns.org/api/game-info/community/${articleId}/comment`, {
        content,
        userId,
        gameCommunityId,
      });
      await fetchComments();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateComment = async ({commentId, content, gameCommunityId, userId}) => {
    try {
      await axios.put(`https://boardjjigae.duckdns.org/api/game-info/community/${articleId}/comment/${commentId}`, {
        content,
        userId,
        gameCommunityId,
      });
      await fetchComments();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return { comments, loading, error, addComment, updateComment, fetchComments };
};
