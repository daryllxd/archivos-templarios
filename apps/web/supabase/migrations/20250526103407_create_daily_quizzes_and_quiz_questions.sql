CREATE TABLE daily_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(category, date)
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_quiz_id UUID NOT NULL REFERENCES daily_quizzes(id) ON DELETE CASCADE,
    question_data JSONB NOT NULL, -- Stores the actual question content and metadata
    answer_data JSONB NOT NULL, -- Stores the actual question content and metadata
    question_name TEXT NOT NULL, -- Name of the question (e.g., "Lightning Bolt")
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_daily_quizzes_category_date ON daily_quizzes(category, date);
CREATE INDEX idx_quiz_questions_daily_quiz_id ON quiz_questions(daily_quiz_id);

-- Add RLS policies
ALTER TABLE daily_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Daily quizzes are viewable by everyone"
    ON daily_quizzes FOR SELECT
    USING (true);

CREATE POLICY "Quiz questions are viewable by everyone"
    ON quiz_questions FOR SELECT
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_daily_quizzes_updated_at
    BEFORE UPDATE ON daily_quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at
    BEFORE UPDATE ON quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 

