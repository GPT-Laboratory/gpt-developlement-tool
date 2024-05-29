import requests
import os

OPENAI_API_KEY = os.getenv("API-KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

def generate_test_cases_with_openai(user_story, num_test_cases):
    conversation = [
        {"role": "system", "content": "You are a helpful assistant capable of generating test case scenarios against the user story provided."},
        {"role": "user", "content": f"Generate a test case suite with {num_test_cases} scenarios for the user story: '{user_story}'"}
    ]

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-3.5-turbo",
            "messages": conversation
        },
    )

    if response.status_code == 200:
        completion_response = response.json()
        generated_text = completion_response.get('choices', [])[0].get('message', {}).get('content', '')
        #return parse_test_cases(generated_text.strip())
        return generated_text.strip()
    else:
        raise Exception("Failed to generate test cases from OpenAI.")


def parse_test_cases(generated_text):
    # Splitting the text into sections based on "**Test Case" as the delimiter
    sections = generated_text.split("**Test Case")
    test_cases = []
    
    # Skipping the first split as it will be empty or irrelevant
    for section in sections[1:]:
        # Extracting the title by finding the first occurrence of ":"
        title_end_index = section.find(":")
        title = "Test Case" + section[:title_end_index]
        
        # Extracting the body by trimming the title part
        body = section[title_end_index+1:].strip()
        
        # Constructing the test case object
        test_case = {
            "title": title.strip(),
            "body": parse_body_details(body.strip())
        }
        print(test_case)
        test_cases.append(test_case)
    
    return test_cases

def parse_body_details(body):
    # Initial structure for the parsed details
    parsed_details = {
        "objective": "",
        "steps": [],
        "expected_result": ""  # Changed from "expected_output" for consistency with your body structure
    }

    # Split the body into lines and remove the first '**' marker if it exists
    lines = body.split('\n')[1:]  # Skip the first empty or marker line

    current_section = None

    for line in lines:
        if '**Objective:**' in line:
            current_section = 'objective'
            parsed_details[current_section] += line.split('**Objective:**')[1].strip()
        elif '**Steps:**' in line:
            current_section = 'steps'
        elif '**Expected Result:**' in line:
            current_section = 'expected_result'
            parsed_details[current_section] += line.split('**Expected Result:**')[1].strip()
        else:
            # Handling steps as a list
            if current_section == 'steps' and line.strip().startswith('1.') or line.strip().startswith('2.') or line.strip().startswith('3.') or line.strip().startswith('4.'):
                parsed_details[current_section].append(line.strip().split(' ', 1)[1].strip())
            # Continuously appending to 'objective' or 'expected_result' if they span multiple lines
            elif current_section in ['objective', 'expected_result']:
                parsed_details[current_section] += ' ' + line.strip()

    return parsed_details


# def parse_body_details(body):
#     # Initialize the structure
#     parsed_details = {
#         "objective": "",
#         "steps": [],
#         "expected_output": ""
#     }
    
#     # Split the body into lines for easier processing
#     lines = body.split("\n")
    
#     # Temporary storage for steps
#     steps_list = []

#     # Process each line
#     for line in lines:
#         # Checking and capturing the Objective
#         if line.strip().startswith("- **Objective:**"):
#             parsed_details["objective"] = line.strip().split("**Objective:**")[1].strip()
        
#         # Checking and capturing the Steps
#         elif line.strip().startswith("- **Steps:**"):
#             # The steps follow this line; captured in subsequent iterations
#             continue
#         elif line.strip().startswith("1.") or line.strip().startswith("2.") or line.strip().startswith("3.") or line.strip().startswith("4."):
#             steps_list.append(line.strip().split(".", 1)[1].strip())
        
#         # Checking and capturing the Expected Output
#         elif line.strip().startswith("- **Expected Output:**"):
#             parsed_details["expected_output"] = line.strip().split("**Expected Output:**")[1].strip()
    
#     # Assigning the steps list to the parsed details
#     parsed_details["steps"] = steps_list

#     return parsed_details

# def parse_test_cases(generated_text):
#     sections = generated_text.split("**Test Case")
#     test_cases = []
    
#     for section in sections[1:]:
#         title_end_index = section.find(":")
#         title = "Test Case" + section[:title_end_index]
        
#         body = section[title_end_index+1:].strip()
        
#         # Now use parse_body_details to parse body into structured format
#         body_details = parse_body_details(body)
        
#         test_case = {
#             "title": title.strip(),
#             "details": body_details  # This now contains objective, steps, and expected output
#         }
#         test_cases.append(test_case)
    
#     return test_cases