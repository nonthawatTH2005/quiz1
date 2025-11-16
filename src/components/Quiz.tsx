import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { Progress } from './ui/progress';

interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: 'เลือกคำแปลของคำว่า "School"',
    options: [
      { id: '1', text: 'อ่าน' },
      { id: '2', text: 'โรงเรียน' },
      { id: '3', text: 'ทำ' },
      { id: '4', text: 'โต๊ะ' }
    ],
    correctAnswer: '2'
  },
  {
    id: 2,
    question: 'เลือกคำแปลของคำว่า "Book"',
    options: [
      { id: '1', text: 'หนังสือ' },
      { id: '2', text: 'ปากกา' },
      { id: '3', text: 'กระดาษ' },
      { id: '4', text: 'ดินสอ' }
    ],
    correctAnswer: '1'
  },
  {
    id: 3,
    question: 'เลือกคำแปลของคำว่า "Teacher"',
    options: [
      { id: '1', text: 'นักเรียน' },
      { id: '2', text: 'แม่บ้าน' },
      { id: '3', text: 'ครู' },
      { id: '4', text: 'หมอ' }
    ],
    correctAnswer: '3'
  }
];

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSubmit = () => {
    if (selectedAnswer) {
      setSubmitted(true);
      setAnswers({ ...answers, [question.id]: selectedAnswer });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setSubmitted(false);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    return (
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle>ผลการทำแบบทดสอบ</CardTitle>
          <CardDescription>คุณทำแบบทดสอบเสร็จสิ้นแล้ว</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">
              {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <div>
              <div className="text-3xl mb-2">
                {score} / {questions.length}
              </div>
              <div className="text-muted-foreground">
                คะแนนที่ได้ {percentage.toFixed(0)}%
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${
                percentage >= 80
                  ? 'bg-green-100 text-green-800'
                  : percentage >= 60
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {percentage >= 80
                ? 'ยอดเยี่ยม! คุณทำได้ดีมาก'
                : percentage >= 60
                ? 'ดีมาก! แต่ยังสามารถพัฒนาได้อีก'
                : 'พยายามอีกนิดนะ ลองทำใหม่ดูไหม?'}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg">สรุปคำตอบ</h3>
            {questions.map((q, index) => {
              const userAnswer = answers[q.id];
              const correct = userAnswer === q.correctAnswer;
              const userOption = q.options.find((opt) => opt.id === userAnswer);
              const correctOption = q.options.find((opt) => opt.id === q.correctAnswer);

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border-2 ${
                    correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="mb-1">
                        <strong>ข้อ {index + 1}:</strong> {q.question}
                      </div>
                      <div className="text-sm">
                        คำตอบของคุณ: {userOption?.text}
                        {!correct && ` (ถูกต้อง: ${correctOption?.text})`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleReset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            ทำแบบทดสอบใหม่
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>แบบสอบถาม</CardTitle>
          <div className="text-sm text-muted-foreground">
            ข้อ {currentQuestion + 1} / {questions.length}
          </div>
        </div>
        <CardDescription>ทดสอบความรู้ภาษาอังกฤษ</CardDescription>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg">{question.question}</h3>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            disabled={submitted}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                  submitted
                    ? option.id === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : option.id === selectedAnswer
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                    : selectedAnswer === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.id}. {option.text}
                </Label>
                {submitted && option.id === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {submitted &&
                  option.id === selectedAnswer &&
                  option.id !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
              </div>
            ))}
          </RadioGroup>
        </div>

        {submitted && (
          <div
            className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>ถูกต้อง!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                <span>
                  ไม่ถูกต้อง คำตอบที่ถูกคือ "
                  {question.options.find((opt) => opt.id === question.correctAnswer)?.text}"
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!selectedAnswer} className="flex-1">
              ส่งคำตอบ
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              {currentQuestion < questions.length - 1 ? (
                <>
                  ข้อถัดไป
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'ดูผลคะแนน'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
