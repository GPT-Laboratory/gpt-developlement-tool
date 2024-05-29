import requests
import re
import json
import os
import json 

OPENAI_API_KEY = os.getenv("API-KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

def parse_prioritized_stories(completion_text):
    pattern = re.compile(r"Story ID (\d+): '([^']+)' \(([^)]+)\)")

    prioritized_stories = []
    for match in pattern.finditer(completion_text):
        story_id, story, category = match.groups()
        prioritized_stories.append({
            "ID": int(story_id),
            "user_story": story,
            "epic": category
        })
    return prioritized_stories

def construct_ahp_prompt(data):
    # Adjusted to match the provided JSON object's structure
    stories_formatted = '\n'.join([f"- Story ID {story['key']}: '{story['user_story']}' (Epic: {story['epic']})" for story in data['stories']])
    criteria_formatted = ', '.join(data['criteria'])
    criteria_comparisons_formatted = json.dumps(data['criteriaComparisons'], indent=2)
    story_comparisons_formatted = {k: json.dumps(v, indent=2) for k, v in data['storyComparisons'].items()}
    
    prompt_content = (
        f"You are a helpful assistant. Using the Analytic Hierarchy Process (AHP), prioritize the following user stories based on the criteria of {criteria_formatted}.\n"
        "Here are the stories:\n"
        f"{stories_formatted}\n\n"
        "The criteria comparisons are as follows:\n"
        f"{criteria_comparisons_formatted}\n\n"
        "The story comparisons under each criterion are as follows:\n"
        f"{json.dumps(story_comparisons_formatted, indent=2)}\n\n"
        "Considering these criteria and their comparisons, along with the user story comparisons under each criterion, please return the prioritized list of user stories by their ID, in descending order of priority."
    )
    return prompt_content

def prioritize_stories_with_ahp(data):
    prompt = construct_ahp_prompt(data)
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    post_data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "system", "content": "You are a helpful assistant trained in AHP."}, {"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    response = requests.post(OPENAI_URL, json=post_data, headers=headers)
    print('response checking: ',response)
    if response.status_code == 200:
        completion = response.json()
        print('completion response',completion)
        completion_text = completion['choices'][0]['message']['content']
        print(completion_text)
        prioritized_stories = parse_prioritized_stories(completion_text)
        print('prioritized_stories ',prioritized_stories)
        return prioritized_stories
    else:
        raise Exception("Failed to process the request with OpenAI")

#***// Prioritize 100 dollar method // **#
def prioritize_stories_with_100_dollar_method(data):
    # Initialize an empty dictionary to store the total scores for each story
    story_scores = {}

    # Iterate over each story
    for story in data['stories']:
        total_score = 0
        
        # Calculate the score for each criterion based on the provided weights
        for criterion, weight in data['criteriaWeights'].items():
            # Assuming each criterion has a score associated with it for each story
            # You can replace this with your own scoring mechanism
            # Here, I'm just multiplying a random score (between 1 and 10) with the weight
            criterion_score = story.get(criterion, 0) * weight
            total_score += criterion_score
        
        # Assign the total score to the story
        story_scores[story['key']] = total_score
    
    # Sort the stories based on their total scores in descending order
    prioritized_stories = sorted(story_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Convert the prioritized stories into the desired format
    prioritized_stories_formatted = []
    for story_id, total_score in prioritized_stories:
        # Find the story details based on its ID
        for story in data['stories']:
            if story['key'] == story_id:
                prioritized_stories_formatted.append({
                    'key': story_id,
                    'user_story': story['user_story'],
                    'epic': story['epic']
                })
                break
    
    return prioritized_stories_formatted



##### Moscow 
def construct_moscow_prompt(user_stories, method):
    stories_formatted = '\n'.join([f"- {story['ID']}: {story['Story']} (Context: {story['Context']})" for story in user_stories])
    prompt_content = (
        f"You are a helpful assistant trained in software development prioritization. "
        f"Using the {method} method, categorize the following user stories into Must have, Should have, Could have, and Won't have:\n\n"
        f"{stories_formatted}\n\n"
        "Please provide the categorization in a structured format."
    )
    return prompt_content

def categorize_stories_with_moscow(user_stories, method):
    prompt = construct_moscow_prompt(user_stories, method)
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    post_data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    response = requests.post(OPENAI_URL, json=post_data, headers=headers)

    if response.status_code == 200:
        completion = response.json()
        completion_text = completion['choices'][0]['message']['content']
        # Implement parsing of completion_text to structure the MoSCoW categorization
        return parse_moscow_categorized_stories(completion_text)
    else:
        raise Exception("Failed to process the request with OpenAI")


def parse_moscow_categorized_stories(completion_text):
    categorized_stories = []

    # Adjusted regex pattern to match the format of your response
    pattern = re.compile(r"\*\*(Must have|Should have|Could have|Won't have):\*\*\n((?:\d+\..+?\n)+)")

    categories = pattern.findall(completion_text)
    for category, stories_text in categories:
        story_pattern = re.compile(r"(\d+)\. (.+?) \(Context: (.+?)\)")
        for story_match in story_pattern.finditer(stories_text.strip()):
            story_id, story, context = story_match.groups()
            categorized_stories.append({
                "ID": int(story_id),  # Assuming the ID refers to the position in the list rather than a unique identifier
                "Story": story,
                "Context": context,
                "Category": category
            })

    return categorized_stories



def generate_stories_with_dynamic_epics(requirements):
   
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    
    stories_with_epics = []

    for req in requirements:
        # Constructing a conversation for each requirement to generate a story and infer an epic
        conversation = [
            {"role": "system", "content": "You are a helpful assistant capable of generating user stories from requirements and assigning relevant epics."},
            {"role": "user", "content": f"Generate a user story and suggest an epic for the requirement: {req}"}
        ]
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json={"model": "gpt-3.5-turbo", "messages": conversation, "temperature": 0.7}
        )
        
        if response.status_code == 200:
            response_data = response.json()
            # Assuming the last assistant message contains both the user story and a suggested epic
            last_message = response_data['choices'][0]['message']['content']
            # Simplified extraction, assuming the story and epic are clearly delineated in the response
            story, suggested_epic = last_message.split('\n')[-2:]  # This is a naive split, adjust based on actual output format
            
            stories_with_epics.append({
                "Requirement": req,
                "GeneratedStory": story.strip(),
                "SuggestedEpic": suggested_epic.strip()
            })
        else:
            raise Exception("Failed to process the request with OpenAI: " + response.text)

    return stories_with_epics

def generate_user_stories_with_epics(objective, num_stories):

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    # Construct the prompt dynamically
    prompt_content = (
        f"You are a helpful assistant capable of generating user stories and suggesting epics from a given objective.\n"
        f"Given the objective: '{objective}', generate {num_stories} distinct user stories, each with an epic."
    )
    
    # Prepare the data for the POST request to OpenAI using the Chat API format
    post_data = json.dumps({
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant capable of generating user stories and suggesting epics from the objective."},
            {"role": "user", "content": prompt_content}
        ],
        "temperature": 0.7
    })

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, data=post_data)
    
    if response.status_code == 200:
        response_data = response.json()
        # Extract generated stories and epics from the last message
        # Note: This will need fine-tuning based on actual model output format
        generated_content = response_data['choices'][0]['message']['content']
        # Placeholder for parsing logic to extract stories and epics into an array of objects
        # Assuming a simple split and parse approach; adjust based on actual response format
        print(generated_content)
        parsed_stories = parse_user_stories(generated_content)
        print(parsed_stories)
        return parsed_stories
    else:
        raise Exception("Failed to process the request with OpenAI: " + response.text)

def parse_user_stories(text_response):
    # Adjusted pattern to match the structured numbered list format
    # Now looking for a number, followed by ". User Story:" and "Epic:", taking into account the new line after "Epic:"
    pattern = re.compile(r"\d+\.\s+User Story: (.*?)\s+Epic: (.*?)\s*(?=\n\d|\n*$)", re.DOTALL)

    # Find all matches of the pattern in the text_response
    matches = pattern.findall(text_response)

    # Initialize the list to collect user stories
    user_stories = []

    # Process matches if found
    for match in matches:
        # Each match is a tuple (User Story, Epic)
        user_stories.append({"user_story": match[0].strip(), "epic": match[1].strip()})

    # Check if the user_stories list is empty, implying no matches were found
    if not user_stories:
        # Handle cases where no matches are found
        user_stories.append({"user_story": "User story not provided", "epic": "Epic not provided"})

    return user_stories







# Parsing the response
