import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const category = getRouterParam(event, "category");
  if (!category) {
    throw createError({
      statusCode: 400,
      message: "Category is required",
    });
  }

  const client = await serverSupabaseClient(event);

  // Get today's quiz for the category
  const { data: quiz, error: quizError } = await client
    .from("daily_quizzes")
    .select("*")
    .eq("category", category)
    .eq("date", new Date().toISOString().split("T")[0])
    .single();

  if (quizError || !quiz) {
    throw createError({
      statusCode: 404,
      message: "No quiz found for today",
    });
  }

  // Get all questions for this quiz
  const { data: questions, error: questionsError } = await client
    .from("quiz_questions")
    .select("*")
    .eq("daily_quiz_id", quiz.id)
    .order("created_at");

  if (questionsError) {
    throw createError({
      statusCode: 500,
      message: "Error fetching quiz questions",
    });
  }

  const response = {
    quiz: quiz,
    questions: questions,
  };

  return response;
});
