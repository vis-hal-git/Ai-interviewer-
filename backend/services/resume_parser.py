"""
Resume Parser Service - Extract information from PDF and DOCX files using LLM
"""
import PyPDF2
import docx
import re
from typing import Dict, List, Optional
from pathlib import Path
import json
from groq import Groq
from config import settings


class ResumeParser:
    """Parse resumes and extract structured information using Groq LLM"""
    
    def __init__(self):
        """Initialize Groq client for LLM-based parsing"""
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        # Using llama-3.3-70b-versatile - Latest high-performance model
        # Alternative: "llama-3.1-70b-versatile" or "gemma2-9b-it"
        self.model = "llama-3.3-70b-versatile"
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error extracting PDF: {e}")
        return text
    
    def extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        text = ""
        try:
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error extracting DOCX: {e}")
        return text
    
    def extract_text(self, file_path: str) -> str:
        """Extract text based on file extension with enhanced methods"""
        file_ext = Path(file_path).suffix.lower()
        if file_ext == '.pdf':
            # Try enhanced extraction first
            text = self.extract_text_from_pdf_enhanced(file_path)
            if not text or len(text.strip()) < 50:
                # Fallback to basic extraction
                print("⚠️ Enhanced extraction failed, using basic method")
                text = self.extract_text_from_pdf(file_path)
            return text
        elif file_ext in ['.docx', '.doc']:
            return self.extract_text_from_docx(file_path)
        else:
            return ""
    
    def extract_basic_info_with_regex(self, text: str) -> Dict[str, Optional[str]]:
        """Extract basic contact info using regex (fast and reliable)"""
        # Email extraction
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        email = emails[0] if emails else None
        
        # Phone extraction with country code
        phone_patterns = [
            r'\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}',  # International format with +
            r'\+\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # +1 (555) 555-5555
            r'\d{3}[-.\s]?\d{3}[-.\s]?\d{4}'  # Simple 10-digit
        ]
        phone = None
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                phone = matches[0].strip()
                break
        
        # LinkedIn extraction
        linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
        linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
        linkedin = linkedin_match.group(0) if linkedin_match else None
        
        # GitHub extraction
        github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
        github_match = re.search(github_pattern, text, re.IGNORECASE)
        github = github_match.group(0) if github_match else None
        
        # Portfolio extraction - try multiple patterns
        portfolio_patterns = [
            r'(?:https?://)?(?:www\.)?[\w-]+\.vercel\.app/?[\w/-]*',
            r'(?:https?://)?(?:www\.)?[\w-]+\.netlify\.app/?[\w/-]*',
            r'(?:https?://)?(?:www\.)?[\w-]+\.herokuapp\.com/?[\w/-]*',
            r'(?:https?://)?(?:www\.)?[\w-]+\.github\.io/?[\w/-]*',
            r'(?:https?://)?portfolio\.[\w-]+\.[\w.]+/?[\w/-]*'
        ]
        portfolio = None
        for pattern in portfolio_patterns:
            portfolio_match = re.search(pattern, text, re.IGNORECASE)
            if portfolio_match:
                portfolio = portfolio_match.group(0)
                break
        
        return {
            'email': email,
            'phone': phone,
            'linkedin': linkedin,
            'github': github,
            'portfolio': portfolio
        }
    
    def extract_hyperlinks_from_pdf(self, file_path: str) -> Dict[str, str]:
        """
        Extract hyperlinks from PDF annotations
        Returns dict with link text mapped to URLs
        """
        links = {}
        all_links = []  # Store all project/portfolio links
        
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    # Extract annotations/links
                    if hasattr(page, 'annots') and page.annots:
                        for annot in page.annots:
                            if annot.get('uri'):  # External URL
                                url = annot['uri']
                                all_links.append(url)
                                
                                # Categorize based on URL
                                url_lower = url.lower()
                                if 'github.com' in url_lower and '/github.com/' in url_lower:
                                    links['github'] = url
                                elif 'linkedin.com/in' in url_lower:
                                    links['linkedin'] = url
                                elif any(domain in url_lower for domain in ['vercel.app', 'netlify.app', 'herokuapp.com', 'github.io']):
                                    # Check if it's not the GitHub profile link
                                    if 'github.io' in url_lower or 'vercel' in url_lower or 'netlify' in url_lower:
                                        if 'portfolio' not in links:
                                            links['portfolio'] = url
                                        else:
                                            # Store as additional project link
                                            if 'project_links' not in links:
                                                links['project_links'] = []
                                            links['project_links'].append(url)
            
            # Store all links for reference
            if all_links:
                links['all_links'] = all_links
            
            if links:
                print(f"🔗 Extracted {len(all_links)} total hyperlinks from PDF")
                for key, url in links.items():
                    if key in ['github', 'linkedin', 'portfolio']:
                        print(f"   {key}: {url}")
                if 'project_links' in links:
                    print(f"   📦 Project links: {len(links['project_links'])} found")
        except Exception as e:
            print(f"⚠️ Could not extract hyperlinks: {e}")
        
        return links
    
    def extract_text_from_pdf_enhanced(self, file_path: str) -> str:
        """
        Enhanced PDF text extraction with better handling
        Extracts text page by page and preserves structure
        Also extracts hyperlinks and appends them to text
        """
        text = ""
        try:
            import pdfplumber
            
            # Extract hyperlinks first
            hyperlinks = self.extract_hyperlinks_from_pdf(file_path)
            
            # Extract text
            with pdfplumber.open(file_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    page_text = page.extract_text()
                    if page_text:
                        text += f"\n--- Page {page_num} ---\n"
                        text += page_text + "\n"
            
            # Append extracted links to text for LLM to process
            if hyperlinks:
                text += "\n--- Extracted Links ---\n"
                if 'github' in hyperlinks:
                    text += f"GitHub Profile: {hyperlinks['github']}\n"
                if 'linkedin' in hyperlinks:
                    text += f"LinkedIn Profile: {hyperlinks['linkedin']}\n"
                if 'portfolio' in hyperlinks:
                    text += f"Portfolio Website: {hyperlinks['portfolio']}\n"
                
                # Add all links so LLM can match them to projects
                if 'all_links' in hyperlinks:
                    text += "\nAll Hyperlinks found in resume:\n"
                    for i, link in enumerate(hyperlinks['all_links'], 1):
                        text += f"{i}. {link}\n"
            
            print(f"✅ Extracted {len(text)} characters from PDF using pdfplumber")
        except ImportError:
            print("⚠️ pdfplumber not available, falling back to PyPDF2")
            # Fallback to PyPDF2
            try:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page_num, page in enumerate(pdf_reader.pages, 1):
                        page_text = page.extract_text()
                        if page_text:
                            text += f"\n--- Page {page_num} ---\n"
                            text += page_text + "\n"
                print(f"✅ Extracted {len(text)} characters from PDF using PyPDF2")
            except Exception as e:
                print(f"❌ Error extracting PDF: {e}")
        except Exception as e:
            print(f"❌ Error with pdfplumber: {e}")
        
        return text
    
    def extract_info_with_llm(self, text: str) -> Dict:
        """
        Use Groq LLM to intelligently extract structured information from resume
        Enhanced with better prompting and error handling
        """
        if not text or len(text.strip()) < 50:
            print("⚠️ Text too short for LLM extraction")
            return self._get_empty_structure()
        
        # Use more text for better context (up to 12000 chars)
        resume_text = text[:12000] if len(text) > 12000 else text
        
        print(f"📝 Sending {len(resume_text)} characters to Groq LLM...")
        
        prompt = f"""You are an expert resume parser. Carefully analyze the following resume and extract ALL information accurately.

RESUME TEXT:
{resume_text}

Extract and return a JSON object with this structure:

{{
    "name": "candidate's full name (extract from top of resume)",
    "skills": ["skill1", "skill2", "skill3", ...],
    "experience": [
        {{
            "title": "job title",
            "company": "company name",
            "duration": "date range",
            "description": "what they did in this role"
        }}
    ],
    "education": [
        {{
            "degree": "degree name (e.g., B.Tech in Computer Science)",
            "institution": "university/college name",
            "year": "graduation year or period",
            "grade": "GPA/CGPA if mentioned"
        }}
    ],
    "certifications": ["cert1", "cert2", ...],
    "projects": [
        {{
            "name": "project name",
            "description": "what the project does",
            "technologies": ["tech1", "tech2"],
            "link": "project URL if available"
        }}
    ],
    "achievements": ["achievement1", "achievement2", ...],
    "languages": ["spoken language1", "spoken language2", ...],
    "publications": [
        {{
            "title": "publication title",
            "venue": "where published",
            "year": "publication year"
        }}
    ],
    "volunteer": [
        {{
            "role": "volunteer role",
            "organization": "org name",
            "duration": "time period"
        }}
    ],
    "summary": "write a professional 2-3 sentence summary highlighting their key strengths and experience"
}}

CRITICAL INSTRUCTIONS:
1. Extract the candidate's ACTUAL NAME from the resume (usually at the top)
2. Extract ALL technical skills: programming languages, frameworks, libraries, tools, databases, cloud platforms, methodologies
3. Extract ALL work experiences with complete details
4. Extract ALL education entries with full details
5. Extract ALL projects with descriptions and technologies used
6. IMPORTANT FOR PROJECTS: Match each project to its URL from the "All Hyperlinks found in resume" section at the bottom. Look for vercel.app, netlify.app, github.io domains and assign them to the correct project based on context
7. Extract any certifications, courses, or professional development
8. Extract achievements, awards, honors, or recognitions
9. IMPORTANT: For "languages" field, extract ONLY SPOKEN/HUMAN LANGUAGES (like English, Hindi, Spanish). DO NOT include programming languages (Python, JavaScript, etc.) - those go in "skills"
10. If no spoken languages section exists in resume, leave languages as empty array []
11. Extract publications, research papers if present
12. Extract volunteer work or extracurricular activities
13. Look for GitHub Profile, LinkedIn Profile, Portfolio Website in the "Extracted Links" section
14. For each project, try to find its deployment link from the hyperlinks list
15. Programming languages like Python, Java, C++, JavaScript should go in "skills" NOT "languages"
16. If a section is not found, use empty array [] or null
17. Return ONLY the JSON object, no markdown formatting, no explanations
18. Ensure the JSON is valid and properly formatted
19. Be thorough - extract EVERY section present in the resume"""

        try:
            print("🤖 Calling Groq API...")
            
            # Call Groq API with retry logic
            max_retries = 2
            for attempt in range(max_retries):
                try:
                    response = self.client.chat.completions.create(
                        model=self.model,
                        messages=[
                            {
                                "role": "system",
                                "content": "You are a professional resume parser. Return only valid JSON with no markdown formatting."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ],
                        temperature=0.1,  # Low temperature for consistent extraction
                        max_tokens=3000,  # Increased for comprehensive extraction
                        top_p=1,
                        stream=False
                    )
                    break
                except Exception as e:
                    if attempt < max_retries - 1:
                        print(f"⚠️ API call failed (attempt {attempt + 1}), retrying... Error: {e}")
                        continue
                    else:
                        raise
            
            # Extract JSON from response
            response_text = response.choices[0].message.content.strip()
            
            print(f"📥 Received response ({len(response_text)} chars)")
            print(f"📄 First 200 chars of response: {response_text[:200]}")
            
            # Clean up response text
            # Remove markdown code blocks if present
            if '```' in response_text:
                # Extract content between code blocks
                json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response_text, re.DOTALL)
                if json_match:
                    response_text = json_match.group(1)
                else:
                    # Try to remove just the markers
                    response_text = re.sub(r'^```(?:json)?\s*', '', response_text)
                    response_text = re.sub(r'\s*```$', '', response_text)
            
            # Remove any leading/trailing whitespace
            response_text = response_text.strip()
            
            # Parse JSON
            print("🔍 Parsing JSON response...")
            extracted_data = json.loads(response_text)
            
            # Validate extracted data
            if not isinstance(extracted_data, dict):
                print(f"⚠️ Response is not a dict: {type(extracted_data)}")
                return self._get_empty_structure()
            
            # Ensure all required keys exist
            required_keys = ['name', 'skills', 'experience', 'education', 'certifications', 'summary']
            optional_keys = ['projects', 'achievements', 'languages', 'publications', 'volunteer']
            
            for key in required_keys:
                if key not in extracted_data:
                    extracted_data[key] = [] if key in ['skills', 'experience', 'education', 'certifications'] else None
            
            for key in optional_keys:
                if key not in extracted_data:
                    extracted_data[key] = []
            
            # Log success
            print(f"✅ LLM extraction successful!")
            print(f"   📛 Name: {extracted_data.get('name')}")
            print(f"   ⚡ Skills: {len(extracted_data.get('skills', []))} found")
            print(f"   💼 Experience: {len(extracted_data.get('experience', []))} positions")
            print(f"   🎓 Education: {len(extracted_data.get('education', []))} entries")
            print(f"   📜 Certifications: {len(extracted_data.get('certifications', []))} found")
            print(f"   🚀 Projects: {len(extracted_data.get('projects', []))} found")
            print(f"   🏆 Achievements: {len(extracted_data.get('achievements', []))} found")
            
            return extracted_data
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON parse error: {e}")
            print(f"📄 Raw response (first 500 chars):")
            print(response_text[:500] if 'response_text' in locals() else "No response")
            return self._get_empty_structure()
            
        except Exception as e:
            print(f"❌ LLM extraction error: {type(e).__name__}: {e}")
            import traceback
            print(f"📍 Traceback: {traceback.format_exc()}")
            return self._get_empty_structure()
    
    def _get_empty_structure(self) -> Dict:
        """Return empty data structure with all possible fields"""
        return {
            "name": None,
            "skills": [],
            "experience": [],
            "education": [],
            "certifications": [],
            "projects": [],
            "achievements": [],
            "languages": [],
            "publications": [],
            "volunteer": [],
            "summary": None
        }
    
    def parse(self, file_path: str) -> Dict:
        """
        Main parsing function - extract all information from resume using LLM
        
        This method:
        1. Extracts text from PDF/DOCX
        2. Uses regex for contact info (fast & reliable)
        3. Uses Groq LLM for intelligent extraction of skills, experience, education
        
        Why this hybrid approach?
        - Regex: Perfect for structured data like email, phone, URLs
        - LLM: Much better for understanding context, extracting skills, summarizing
        """
        print(f"📄 Parsing resume: {file_path}")
        
        # Step 1: Extract text from file
        text = self.extract_text(file_path)
        
        if not text or len(text.strip()) < 50:
            print("⚠️ Resume text is too short or empty")
            return {
                "name": "Unknown",
                "email": None,
                "phone": None,
                "skills": [],
                "experience": [],
                "education": [],
                "certifications": [],
                "summary": None,
                "linkedin": None,
                "github": None,
                "portfolio": None,
                "raw_text": ""
            }
        
        print(f"✅ Extracted {len(text)} characters from resume")
        print(f"📄 Text preview (first 300 chars):\n{text[:300]}...\n")
        
        # Step 2: Extract contact info using regex (fast and reliable)
        print("📧 Extracting contact information with regex...")
        basic_info = self.extract_basic_info_with_regex(text)
        print(f"   ✉️  Email: {basic_info.get('email')}")
        print(f"   📱 Phone: {basic_info.get('phone')}")
        print(f"   🔗 LinkedIn: {basic_info.get('linkedin')}")
        print(f"   🔗 GitHub: {basic_info.get('github')}")
        print(f"   🌐 Portfolio: {basic_info.get('portfolio')}")
        
        # Step 3: Extract structured data using LLM (intelligent parsing)
        print("\n🤖 Extracting structured data with Groq LLM...")
        llm_data = self.extract_info_with_llm(text)
        
        # Step 4: Combine results
        result = {
            "name": llm_data.get("name") or "Candidate",
            "email": basic_info["email"],
            "phone": basic_info["phone"],
            "skills": llm_data.get("skills", []),
            "experience": llm_data.get("experience", []),
            "education": llm_data.get("education", []),
            "certifications": llm_data.get("certifications", []),
            "projects": llm_data.get("projects", []),
            "achievements": llm_data.get("achievements", []),
            "languages": llm_data.get("languages", []),
            "publications": llm_data.get("publications", []),
            "volunteer": llm_data.get("volunteer", []),
            "summary": llm_data.get("summary"),
            "linkedin": basic_info["linkedin"],
            "github": basic_info["github"],
            "portfolio": basic_info.get("portfolio"),  # Use portfolio from regex extraction
            "raw_text": text[:5000]  # Limit to first 5000 chars
        }
        
        print(f"✅ Parsing complete! Found: {len(result['skills'])} skills, "
              f"{len(result['experience'])} experiences, {len(result['education'])} education entries, "
              f"{len(result['projects'])} projects, {len(result['achievements'])} achievements")
        
        return result


# Singleton instance
resume_parser = ResumeParser()
