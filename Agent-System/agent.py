from typing import List
import json
from schema import Thought, RecipeRequest, RecipeResponse
from tools import TOOLS
from llm import extract_json, client
from logging_config import logger

def run_agent(
    input: RecipeRequest,
    max_steps: int = 5,
    model: str = "HuggingFaceTB/SmolLM3-3B",
) -> RecipeResponse:

    memory: List[dict] = [
        {       
            "role": "system",
            "content": """
                You are a ReAct-style chef agent.

                Rules:
                - Use tools when needed.
                - When you have enough information to produce the final recipe,
                you MUST call the tool that returns a RecipeResponse.
                - Once that tool is called, STOP.
                - Do NOT continue thinking after producing the final recipe.
                """
        },
        {
            "role": "user",
            "content": f"Ingredients: {input.ingredients}"
        }
    ]

    for step in range(max_steps):
        logger.info(f"Agent step {step+1}/{max_steps}")

        completion = client.chat.completions.create(
            model=model,
            messages=memory,
        )

        output = completion.choices[0].message.content
        logger.debug(f"LLM output: {output}")

        try:
            json_text = extract_json(output)
            thought = Thought(**json.loads(json_text))
            logger.info(
                f"Thought: {thought.reasoning} | Action: {thought.action}"
            )
        except Exception as e:
            memory.append({
                "role": "system",
                "content": f"Invalid JSON: {e}. Return ONLY valid JSON."
            })
            continue

        if thought.action not in TOOLS:
            raise ValueError(f"Unknown action: {thought.action}")

        result = TOOLS[thought.action](input)

        memory.append({
            "role": "system",
            "content": f"Observation: {result.model_dump_json()}"
        })

        if isinstance(result, RecipeResponse):
            return result

    raise RuntimeError("Agent failed to produce final answer")
