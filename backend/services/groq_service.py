"""
Groq API service for LLM and Whisper (Speech-to-Text)
"""
from groq import Groq
from config import settings
from typing import List, Dict
import json


class GroqService:
    """Groq API wrapper for LLM and Whisper"""
    
    def __init__(self):
        """Initialize Groq client"""
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.llm_model = "llama-3.3-70b-versatile"  # Updated from deprecated mixtral-8x7b-32768
        self.whisper_model = "whisper-large-v3"
    
    def generate_questions(self, resume_data: Dict, job_role: str, num_questions: int = 10) -> List[Dict]:
        """
        Generate interview questions based on resume and job role
        20% general, 80% technical
        
        Args:
            resume_data: Parsed resume information
            job_role: Target job role
            num_questions: Total number of questions (default 10)
            
        Returns:
            List of interview questions with metadata
        """
        try:
            # Extract key information from resume
            skills = resume_data.get("skills", [])
            experience = resume_data.get("experience", [])
            education = resume_data.get("education", [])
            projects = resume_data.get("projects", [])
            
            # Build context
            skills_str = ", ".join(skills[:10]) if skills else "general programming"
            exp_years = len(experience) if experience else 0
            
            # Create prompt
            prompt = f"""You are an expert technical interviewer conducting an interview for a {job_role} position.

Based on the candidate's profile:
- Skills: {skills_str}
- Years of Experience: {exp_years}
- Education: {education[0].get('degree', 'Computer Science') if education else 'Computer Science'}
- Projects: {len(projects)} project(s)

Generate exactly {num_questions} interview questions following this distribution:
- 2 general/behavioral questions (20%)
- 8 technical questions (80%) based on their skills and job role

For each question, provide:
1. The question text
2. Category (general, technical, behavioral)
3. Difficulty level (easy, medium, hard)
4. Expected skills being tested

Return ONLY a JSON array in this exact format:
[
  {{
    "question": "Tell me about yourself and your background.",
    "category": "general",
    "difficulty": "easy",
    "skills_tested": ["communication", "background"]
  }},
  {{
    "question": "Explain how you would implement...",
    "category": "technical",
    "difficulty": "medium",
    "skills_tested": ["Python", "algorithm design"]
  }}
]

Make questions specific to {job_role} and the candidate's skills: {skills_str}.
Return ONLY the JSON array, no additional text."""

            # Call Groq API
            response = self.client.chat.completions.create(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": "You are an expert technical interviewer. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON if wrapped in markdown
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0].strip()
            
            # Parse JSON
            questions = json.loads(response_text)
            
            # Validate and return
            if isinstance(questions, list) and len(questions) > 0:
                return questions[:num_questions]
            else:
                # Fallback to default questions
                return self._get_default_questions(job_role)
                
        except Exception as e:
            print(f"❌ Error generating questions: {e}")
            # Return default questions on error
            return self._get_default_questions(job_role)
    
    def _get_default_questions(self, job_role: str) -> List[Dict]:
        """Fallback questions if LLM fails"""
        return [
            {
                "question": "Tell me about yourself and your professional background.",
                "category": "general",
                "difficulty": "easy",
                "skills_tested": ["communication", "background"]
            },
            {
                "question": "Why are you interested in this role?",
                "category": "behavioral",
                "difficulty": "easy",
                "skills_tested": ["motivation", "career goals"]
            },
            {
                "question": f"What experience do you have that makes you a good fit for a {job_role} position?",
                "category": "technical",
                "difficulty": "medium",
                "skills_tested": ["experience", "domain knowledge"]
            },
            {
                "question": "Describe a challenging project you've worked on and how you solved it.",
                "category": "behavioral",
                "difficulty": "medium",
                "skills_tested": ["problem-solving", "project management"]
            },
            {
                "question": "How do you stay updated with the latest technologies in your field?",
                "category": "general",
                "difficulty": "easy",
                "skills_tested": ["learning", "passion"]
            },
            {
                "question": f"What technical skills are most important for a {job_role}?",
                "category": "technical",
                "difficulty": "medium",
                "skills_tested": ["technical knowledge"]
            },
            {
                "question": "Describe your development workflow and tools you use daily.",
                "category": "technical",
                "difficulty": "medium",
                "skills_tested": ["tools", "workflow"]
            },
            {
                "question": "Tell me about a time you had to work under pressure.",
                "category": "behavioral",
                "difficulty": "medium",
                "skills_tested": ["stress management", "adaptability"]
            },
            {
                "question": "How do you handle code reviews and feedback?",
                "category": "behavioral",
                "difficulty": "easy",
                "skills_tested": ["collaboration", "growth mindset"]
            },
            {
                "question": "What are your career goals for the next 2-3 years?",
                "category": "general",
                "difficulty": "easy",
                "skills_tested": ["career planning", "ambition"]
            }
        ]
    
    def generate_follow_up_question(self, original_question: str, candidate_answer: str, job_role: str) -> str:
        """
        Generate adaptive follow-up question based on candidate's answer
        
        Args:
            original_question: The original question asked
            candidate_answer: Candidate's answer to the original question
            job_role: Job role being interviewed for
            
        Returns:
            Follow-up question string
        """
        try:
            prompt = f"""You are an expert interviewer conducting an interview for a {job_role} position.

Original Question: {original_question}

Candidate's Answer: {candidate_answer}

Based on the candidate's response, generate ONE insightful follow-up question that:
1. Digs deeper into their answer
2. Tests their practical knowledge or experience
3. Clarifies any vague points
4. Is specific to their response
5. Is relevant to the {job_role} role

Return ONLY the follow-up question text, no additional formatting or explanations."""

            response = self.client.chat.completions.create(
                model=self.llm_model,
                messages=[
                    {"role": "system", "content": "You are an expert technical interviewer. Generate concise, targeted follow-up questions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            follow_up = response.choices[0].message.content.strip()
            
            # Clean up any quotes or formatting
            follow_up = follow_up.strip('"\'')
            
            return follow_up
                
        except Exception as e:
            print(f"❌ Error generating follow-up question: {e}")
            # Fallback generic follow-up
            return "Can you elaborate more on that with a specific example?"
    
    def generate_followup(self, previous_answer: str, context: Dict) -> str:
        """
        DEPRECATED: Use generate_follow_up_question instead
        """
        return self.generate_follow_up_question(
            context.get("question", ""),
            previous_answer,
            context.get("job_role", "")
        )
    
    def evaluate_answer(self, question: str, answer: str, expected_skills: List[str]) -> Dict[str, float]:
        """
        Evaluate candidate's answer using LLM
        
        Args:
            question: Interview question
            answer: Candidate's answer
            expected_skills: Expected skills for the role
            
        Returns:
            Dictionary with scores (technical, clarity, depth, relevance)
        """
        # TODO: Implement answer evaluation (Phase 4)
        pass
    
    def transcribe_audio(self, audio_file_path: str) -> str:
        """
        Transcribe audio to text using Groq Whisper
        
        Args:
            audio_file_path: Path to audio file
            
        Returns:
            Transcribed text
        """
        # TODO: Implement audio transcription with Whisper (Phase 3)
        pass
    
    def generate_report_analysis(self, interview_data: Dict) -> str:
        """
        Generate detailed analysis for interview report
        
        Args:
            interview_data: Complete interview data
            
        Returns:
            Detailed analysis text
        """
        # TODO: Implement report analysis generation (Phase 4)
        pass


# Singleton instance
groq_service = GroqService()
