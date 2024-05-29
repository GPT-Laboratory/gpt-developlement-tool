from dotenv import load_dotenv
import os
import tempfile
from flask import Flask, render_template,send_file, send_from_directory, request, jsonify
#import datetimeimport 
import requests
import os
import json
import re 
import openai

from io import BytesIO
from plantuml import PlantUML

from agent import prioritize_stories_with_ahp, categorize_stories_with_moscow, generate_stories_with_dynamic_epics, generate_user_stories_with_epics, prioritize_stories_with_100_dollar_method  # Make sure agent.py is accessible
from agent2 import convert_json_to_csv_Ahp,convert_json_to_csv_100_dollar,save_uploaded_file, parse_csv_to_json, convert_json_to_csv
from agent3 import generate_test_cases_with_openai

from flask_cors import CORS


load_dotenv()


key = os.getenv("ELSEVIER_API_KEY")

app = Flask(__name__, static_folder='dist')
CORS(app)

OPENAI_API_KEY = os.getenv("API-KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
OCTOAI_URL = "https://text.octoai.run/v1/chat/completions"
OCTOAI_KEY = os.getenv("OCTOAI_KEY")


current_dir = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(current_dir, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def parse_prioritized_stories(completion_text):
    # Regex pattern to match the structured story details in the response
    pattern = re.compile(r"Story ID (\d+): '([^']+)' \(Context: ([^,]+), Epic: ([^\)]+)\)")
    
    # Find all matches and convert them into a list of dictionaries
    prioritized_stories = []
    for match in pattern.finditer(completion_text):
        story_id, story, context, epic = match.groups()
        prioritized_stories.append({
            "ID": int(story_id),
            "Story": story,
            "Context": context,
            "Epic": epic
        })
    
    return prioritized_stories


def construct_ahp_prompt(data):
    # Formatting the input for readability and AHP processing
    stories_formatted = '\n'.join([f"- Story ID {story['ID']}: '{story['Story']}' (Context: {story['Context']}, Epic: {story['Epic']})" for story in data['stories']])
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

def separate_text_and_code(prompt):
    
    code_pattern = r'```(?:\w+\n)?([\s\S]+?)```' # regular expression to identify code blocks
    
    code_blocks = re.findall(code_pattern, prompt)
  
    text_only = re.sub(code_pattern, '', prompt)
    
    return text_only.strip(), code_blocks

def format_code_response(code_response):
    return f'\n{code_response}\n'

def format_response(text_response, code_responses):
    formatted_text = text_response.strip()
    formatted_code = '\n'.join([format_code_response(code) for code in code_responses])
    return formatted_text, formatted_code

def extract_uml_code(text):
    # Convert text to lowercase to handle case insensitivity
    lower_text = text.lower()
    start_keyword = "@startuml"
    end_keyword = "@enduml"

    # Find the index of the start and end of the UML block
    start_index = lower_text.find(start_keyword)
    end_index = lower_text.find(end_keyword, start_index)  # Ensure end is after start

    if start_index != -1 and end_index != -1:
        # Extract and return the UML code, ensure original text format is preserved
        uml_code = text[start_index:end_index + len(end_keyword)]
        return uml_code.strip()  # Optionally strip any extra whitespace around the UML code
    else:
        return None
    
plantuml_server = 'http://www.plantuml.com/plantuml'
    
def plant_uml_response(uml_text):
    if not uml_text:
        return jsonify({"error": "No UML text provided"}), 400

    # Assuming plantuml_server is correctly defined earlier in your code
    plantuml = PlantUML(url=f'{plantuml_server}/svg/')

    try:
        diagram_url = plantuml.get_url(uml_text)  # Get the URL for the UML diagram
        response = requests.get(diagram_url)  # Fetch the diagram from the URL
        print(response)
        if response.status_code == 200:

            # Return the file if the response is successful
            return send_file(
                BytesIO(response.content),  # Create a BytesIO object from the content
                mimetype='image/svg+xml',  # Set the correct MIME type
                as_attachment=True,  # Send as an attachment
                download_name="diagram.svg"  # Name of the download file
            )
        else:
            # Return an error if the PlantUML server failed to generate the diagram
            return jsonify({"error": "PlantUML server failed to generate the diagram", "status": response.status_code}), response.status_code
    except Exception as e:
        # Return an error if there was an exception during the process
        return jsonify({"error": "Failed to generate UML diagram", "details": str(e)}), 500



@app.route('/api/prioritize', methods=['POST'])
def prioritize_stories():
    data = request.json
    if not data or 'stories' not in data or 'criteria' not in data:
        return jsonify({'error': 'Missing required data: stories and criteria'}), 400
    
    prompt = construct_ahp_prompt(data)

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    # Prepare the data for the POST request to OpenAI using the Chat API format
    post_data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant trained in AHP."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    # Make the POST request
    response = requests.post(OPENAI_URL, json=post_data, headers=headers)

    if response.status_code == 200:
        completion = response.json()
        completion_text = completion['choices'][0]['message']['content']
        
        # Use the parsing function to convert the response into structured data
        prioritized_stories = parse_prioritized_stories(completion_text)
        
        return jsonify({"prioritized_stories": prioritized_stories})
    else:
        return jsonify({'error': 'Failed to process the request with OpenAI'}), response.status_code

@app.route('/api/prioritize/ahp', methods=['POST'])
def prioritize():
    data = request.json
    if not data or 'stories' not in data or 'criteria' not in data:
        return jsonify({'error': 'Missing required data: stories and criteria'}), 400
    
    try:
        prioritized_stories = prioritize_stories_with_ahp(data)
        print(prioritize_stories)
        return jsonify({"prioritized_stories": prioritized_stories})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

    
@app.route('/api/prioritize/100-dollar-method', methods=['POST'])
def prioritize_100_dollar_method():
    data = request.json
    if not data or 'stories' not in data or 'criteria' not in data or 'criteriaWeights' not in data:
        return jsonify({'error': 'Missing required data: stories, criteria, and criteriaWeights'}), 400
    
    try:
        prioritized_stories = prioritize_stories_with_100_dollar_method(data)
        return jsonify({"prioritized_stories": prioritized_stories})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
## 100 dollar method
def construct_batch_wsjf_prompt(data):
    # Generate a formatted string listing each story with its ID, user story, and epic.
    stories_formatted = '\n'.join([
        f"- Story ID {story['key']}: '{story['user_story']}' (Epic: {story['epic']})"
        for story in data['stories']
    ])
    
    # Construct the full prompt with an introduction and detailed instructions, specifying the need for numeric values.
    prompt = (
        "You are a helpful assistant trained in WSJF factor estimation. "
        "For each of the following user stories, please provide estimated numeric values (scale 1 to 10) for the WSJF factors:\n\n"
        f"Here are the stories:\n{stories_formatted}\n\n"
        "Please consider the following factors and provide values on a scale of 1 to 10, where 1 represents the lowest impact or effort and 10 represents the highest:\n"
        "- Business Value (BV): The relative importance of this story to the business or stakeholders.\n"
        "- Time Criticality (TC): The urgency of delivering this story sooner rather than later.\n"
        "- Risk Reduction/Opportunity Enablement (RR/OE): The extent to which delivering this story can reduce risks or enable new opportunities.\n"
        "- Job Size (JS): The amount of effort required to complete this story, typically measured in story points or ideal days.\n\n"
    )
    return prompt


@app.route('/api/estimate_wsjf', methods=['POST'])
def estimate_wsjf():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing required data: stories and criteria'}), 400
    
    try:
        prioritized_stories = prompt = construct_batch_wsjf_prompt(data)
        estimated_factors = send_to_llm(prompt, data)
        return jsonify({"prioritized_stories": estimated_factors})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def sort_stories_by_wsjf_in_place(enriched_stories):
    # Sort the stories in place by WSJF score in descending order (highest score first)
    enriched_stories.sort(key=lambda story: story.get('wsjf_score', 0), reverse=True)    

def send_to_llm(prompt, data):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    post_data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant trained in WSJF factor estimation."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }

    response = requests.post(OPENAI_URL, json=post_data, headers=headers)

    if response.status_code == 200:
        completion = response.json()
        response_text =  completion['choices'][0]['message']['content']
        print('response one',response_text)
        
        wsjf_factors = parse_wsjf_response(response_text)
        print("print wsjf", wsjf_factors)
        
        enriched_stories = enrich_original_stories_with_wsjf(data['stories'], wsjf_factors)
        print("enrich", enriched_stories)
        #wsjf_factors_by_id = parse_wsjf_response(response_text)

       
        # for story in enriched_stories:
        #     print(story)
        
        return enriched_stories
        
    else:
        raise Exception("Failed to communicate with OpenAI: " + response)

def parse_wsjf_response(response_text):
    # Adjusted regex pattern to match the provided formatting in the response text
    pattern = re.compile(
        r"- Story ID (\d+): (.+?)\n"  # Capture the story ID and the epic
        r"\s+- Business Value \(BV\): (\d+)\n"  # Capture Business Value
        r"\s+- Time Criticality \(TC\): (\d+)\n"  # Capture Time Criticality
        r"\s+- Risk Reduction/Opportunity Enablement \(RR/OE\): (\d+)\n"  # Capture Risk Reduction/Opportunity Enablement
        r"\s+- Job Size \(JS\): (\d+)"  # Capture Job Size
    )

    # Find all matches and structure them into a list of dictionaries
    print('pattern: ',pattern)
    stories = []
    for match in pattern.finditer(response_text):
        story_id, epic, bv, tc, rr_oe, js = match.groups()
        story_info = {
            'story_id': int(story_id),
            'epic': epic,
            'wsjf_factors': {
                'BV': int(bv),
                'TC': int(tc),
                'RR/OE': int(rr_oe),
                'JS': int(js)
            }
        }
        stories.append(story_info)

    return stories


def enrich_original_stories_with_wsjf(original_stories, wsjf_factors):
    # Convert wsjf_factors list to a dictionary for faster lookup, assuming it contains 'story_id' and 'wsjf_factors'
    wsjf_dict = {factor['story_id']: factor['wsjf_factors'] for factor in wsjf_factors}

    enriched_stories = []
    for story in original_stories:
        story_id = story['key']  # Assuming 'key' corresponds to 'Story ID'
        if story_id in wsjf_dict:
            # Update the story with WSJF factors from the wsjf_dict
            story['wsjf_factors'] = wsjf_dict[story_id]
            # Calculate the WSJF score using the values in the 'wsjf_factors' dictionary
            bv = story['wsjf_factors']['BV']
            tc = story['wsjf_factors']['TC']
            rr_oe = story['wsjf_factors']['RR/OE']
            js = story['wsjf_factors']['JS']
            wsjf_score = (bv + tc + rr_oe) / js if js != 0 else 0  # Prevent division by zero
            story['wsjf_score'] = wsjf_score
        enriched_stories.append(story)
    return enriched_stories

@app.route('/api/prioritize/moscow', methods=['POST'])
def prioritize_stories_moscow():
    data = request.json
    if not data or 'stories' not in data:
        return jsonify({'error': 'Missing required data: stories'}), 400
    
    try:
        categorized_stories = categorize_stories_with_moscow(data['stories'], data['method'])
        return jsonify({"categorized_stories": categorized_stories})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Dynamic upload folder setup

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    file_path, error = save_uploaded_file(UPLOAD_FOLDER, file)
    
    if error:
        return jsonify({'error': error}), 400
    if file_path:
        csv_data = parse_csv_to_json(file_path)
        return jsonify({"stories_with_epics" : csv_data})

@app.route('/api/generate-user-stories', methods=['POST'])
def generate_user_stories():
    data = request.json
    if not data or 'objective' not in data or 'num_stories' not in data:
        return jsonify({'error': 'Missing required data: objective and num_stories'}), 400
    
    objective = data['objective']
    num_stories = data['num_stories']
    stories_with_epics = generate_user_stories_with_epics(objective, num_stories)
    return jsonify({"stories_with_epics": stories_with_epics})


@app.route('/api/convert-and-download', methods=['POST'])
def convert_and_download():
    data = request.json
    if not data or 'prioritize_stories' not in data:
        return jsonify({'error': 'Invalid input format'}), 400

    prioritize_stories = data['prioritize_stories']
    csv_file_path = os.path.join(UPLOAD_FOLDER, 'user_stories.csv')

    try:
        # Convert JSON to CSV
        convert_json_to_csv(prioritize_stories, csv_file_path)
        
        # Serve the CSV file for download
        return send_file(csv_file_path, as_attachment=True, download_name='user_stories.csv')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/convert-and-download100dollar', methods=['POST'])
def convert_and_download_100_dollar():
    data = request.json
    if not data or 'prioritize_stories' not in data:
        return jsonify({'error': 'Invalid input format'}), 400

    prioritize_stories = data['prioritize_stories']
    csv_file_path = os.path.join(UPLOAD_FOLDER, 'user_stories.csv')

    try:
        # Convert JSON to CSV
        convert_json_to_csv_100_dollar(prioritize_stories, csv_file_path)
        
        # Serve the CSV file for download
        return send_file(csv_file_path, as_attachment=True, download_name='user_stories.csv')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/convert-and-downloadAhp', methods=['POST'])
def convert_and_download_Ahp():
    data = request.json
    if not data or 'prioritize_stories' not in data:
        return jsonify({'error': 'Invalid input format'}), 400

    prioritize_stories = data['prioritize_stories']
    csv_file_path = os.path.join(UPLOAD_FOLDER, 'user_stories.csv')

    try:
        # Convert JSON to CSV
        convert_json_to_csv_Ahp(prioritize_stories, csv_file_path)
        
        # Serve the CSV file for download
        return send_file(csv_file_path, as_attachment=True, download_name='user_stories.csv')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-test-cases', methods=['POST'])
def api_generate_test_cases():
    data = request.json
    user_story = data.get('user_story', '')
    num_test_cases = data.get('num_test_cases', 4)  # Default to 4 test cases if not specified

    try:
        generated_text = generate_test_cases_with_openai(user_story, num_test_cases)
        return jsonify({"test_cases": generated_text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/generate-code', methods=['POST'])
def chat():
    content = request.json.get('content', '')
    model = request.json.get('model','')
    method = request.json.get('method', '')
     
    # first two conditions for frontend methods
    if model == 'gpt-3.5-turbo' and method == 'frontend':
        bot_prompt_file = "agent3.5frontend_prompt.txt"
        print('frontend gpt-3.5 working')
        url = OPENAI_URL
        key = OPENAI_API_KEY
    
    if model == 'gpt-4' and method == 'frontend':
        bot_prompt_file = "agent4frontend_prompt.txt"
        print('frontend gpt-4 working')
        url = OPENAI_URL
        key = OPENAI_API_KEY

    if model == 'codellama' and method == 'frontend':
        bot_prompt_file = "agentcodellamafrontend_prompt.txt"
        print('frontend codellama is working now')
        url = OCTOAI_URL
        key = OCTOAI_KEY

    # Second two conditions for backend methods
    if model == 'gpt-3.5-turbo' and method == 'backend':
        bot_prompt_file = "agent3.5turbo_prompt.txt"
        print('gpt-3.5 backend is working now')
        url = OPENAI_URL
        key = OPENAI_API_KEY

    if model == 'gpt-3.5-turbo' and method == 'unit':
        bot_prompt_file = "agentunittest_prompt.txt"
        print('gpt-3.5 Unit Test is working now')
        url = OPENAI_URL
        key = OPENAI_API_KEY 

    if model == 'gpt-3.5-turbo' and method == 'end_to_end':
        bot_prompt_file = "agentendtoend_prompt.txt"
        print('gpt-3.5 end_to_end is working now')
        url = OPENAI_URL
        key = OPENAI_API_KEY        

    if model == 'gpt-4' and method == 'backend':
        bot_prompt_file = "agent4_prompt.txt"
        print('gpt-4 backend is working now')
        url = OPENAI_URL
        key = OPENAI_API_KEY

    if model == 'codellama' and method == 'backend':
        bot_prompt_file = "agentCodellama34b_prompt"
        print('backend codellama is working now')
        url = OCTOAI_URL
        key = OCTOAI_KEY

    # this conditions for UML-Diagram method
    if model == 'gpt-3.5-turbo' and method == 'UML-diagram':
        bot_prompt_file = "agentplantUML.txt"
        print('Uml diagram is working now')
        url = OPENAI_URL
        key = OPENAI_API_KEY

    

    bot_prompt = open(bot_prompt_file, "r").read()
    bot_1 = bot_prompt.replace("PROJECT_DESCRIPTION", content)
    conversation_history_bot_1 = []
    conversation_history_bot_1.append({'role': 'system', 'content': bot_1})

    post_data={
        "model": model,
        "messages": conversation_history_bot_1
    }   

    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    

    response = requests.post(url, json=post_data, headers=headers)

    if response.status_code == 200:
        completion = response.json()
        text_response = completion['choices'][0]['message']['content']
    else:
        print(response.content)
        raise Exception("Failed to process the request with OpenAI")
    
    code_responses = []

    text_only, code_blocks = separate_text_and_code(text_response)

    for code_block in code_blocks:
            code_responses.append(code_block.strip())

    formatted_text_response, formatted_code_response = format_response(text_only, code_responses)
    
    if model == "gpt-3.5-turbo" and method == 'UML-diagram' :
        uml_code = extract_uml_code(formatted_code_response)
        
        print(uml_code)
        return plant_uml_response(uml_code)
    
    else:
        return jsonify({'Response': formatted_text_response, 'Code': formatted_code_response})




@app.route('/generate-uml', methods=['POST'])
def generate_uml():
    content = request.json.get('content', '')
    model = request.json.get('model','')
    method = request.json.get('method', '')
    uml_text = request.data.decode('utf-8')  # Extract UML text from POST request
    if not uml_text:
        return jsonify({"error": "No UML text provided"}), 400

    # Create a PlantUML object with the server URL
    plantuml = PlantUML(url=f'{plantuml_server}/svg/')

    # Generate diagram
    try:
        diagram_url = plantuml.get_url(uml_text)  # This should get the URL for the SVG
        response = requests.get(diagram_url)  # Fetch the diagram from the URL
        if response.status_code == 200:
            return send_file(
                BytesIO(response.content),  # Create a BytesIO object from the content
                mimetype='image/svg+xml',  # Set the correct MIME type
                as_attachment=True,  # Send as an attachment
                download_name="diagram.svg"  # Correct parameter for setting the file name
            )
        else:
            return jsonify({"error": "PlantUML server failed to generate the diagram", "status": response.status_code}), response.status_code
    except Exception as e:
        return jsonify({"error": "Failed to generate UML diagram", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
