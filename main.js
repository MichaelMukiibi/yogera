// Register service worker and uses MediaPipe Library
import { LlmInference, FilesetResolver } from "@mediapipe/tasks-genai";

const MODEL_ASSET_PATH = './ganda-gemma-1b-litert-task'
const outputElement = document.getElementById('output')

// Register Service Worker first
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./serviceWorker.js')
        .then(registration => {
            console.log('Service Worker registered successfully: ', registration)
        })
        .catch(error => {
            console.log('Service Worker registration failed: ', error)
        })
    } else {
        console.warn('Service workers are not supposed in this browser.')
    }
}

// Load and run the MediaPipe LLM
async function runModel() {
    outputElement.textContent = 'Loading model... (Might take a moment the first time)'

    try {
        // Locate WASM and Worker files using FilesetResolver
        const fileset = await FilesetResolver.forLlmTask()

        // Inference object
        const llmInference = new LlmInference(fileset)

        // Initialize the model with the .task file
        await llmInference.initialize({
            modelAssetPath: MODEL_ASSET_PATH,

            // Model configuration
            maxTokens: 1024,
            topK: 40,
            temperature: 0.8,
            randomSeed: 123
        })

        outputElement.textContent = 'Model loaded. Generating response...'

        // Run inference
        const prompt = 'Translate to Luganda: The culture of Buganda is quite essential to national development.'

        // To be intercepted by Service Worker
        const result = await llmInference.generateResponse({ prompt })

        outputElement.textContent = `
        Prompt: ${prompt}
        -----------------------------
        Response:
        ${result.text}
        `;
    } catch (error) {
        console.error('Error loading or running the model:', error)
        outputElement.textContent = `Error: ${error.message}`
    }
}

// Start process
registerServiceWorker()
runModel()