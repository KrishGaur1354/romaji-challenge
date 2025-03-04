import * as tf from '@tensorflow/tfjs';

export interface LayerActivation {
  layerName: string;
  activation: number[][][];
}

export interface RecognitionResult {
  character: string;
  probability: number;
  layerActivations: LayerActivation[];
  intermediateOutputs: number[][][];
}

class RecognitionService {
  private model: tf.LayersModel | null = null;
  private isModelLoading: boolean = false;
  private modelLoadError: string | null = null;

  // Character mapping between model output indices and actual characters
  private CHARACTER_MAP: { [key: number]: string } = {
    0: 'あ', 1: 'い', 2: 'う', 3: 'え', 4: 'お',
    5: 'か', 6: 'き', 7: 'く', 8: 'け', 9: 'こ',
    // ... more characters will be loaded from character_map.json
  };

  async loadModel(): Promise<void> {
    if (this.model || this.isModelLoading) return;

    this.isModelLoading = true;
    this.modelLoadError = null;

    try {
      // Load character mapping
      const charMapResponse = await fetch('/models/japanese_character_model/character_map.json');
      this.CHARACTER_MAP = await charMapResponse.json();

      // Load the model
      this.model = await tf.loadLayersModel('/models/japanese_character_model/model.json');
      
      // Warm up the model
      const dummyInput = tf.zeros([1, 64, 64, 1]);
      await this.model.predict(dummyInput, { verbose: true });
      dummyInput.dispose();

      console.log('Japanese character recognition model loaded successfully');
    } catch (error) {
      console.error('Failed to load model:', error);
      this.modelLoadError = 'Could not load the character recognition model';
      throw error;
    } finally {
      this.isModelLoading = false;
    }
  }

  async preprocessImage(imageData: ImageData): Promise<tf.Tensor4D> {
    return tf.tidy(() => {
      // Convert the image data to a tensor
      let tensor = tf.browser.fromPixels(imageData, 1);
      
      // Resize to 64x64
      tensor = tf.image.resizeBilinear(tensor, [64, 64]);
      
      // Normalize to [0,1]
      tensor = tensor.toFloat().div(tf.scalar(255));
      
      // Add batch dimension
      return tensor.expandDims(0) as tf.Tensor4D;
    });
  }

  async getIntermediateActivations(input: tf.Tensor4D): Promise<LayerActivation[]> {
    if (!this.model) throw new Error('Model not loaded');

    const activations: LayerActivation[] = [];
    
    // Create a new model that outputs intermediate layer activations
    const layerOutputs = this.model.layers.map(layer => {
      return {
        name: layer.name,
        output: layer.output as tf.SymbolicTensor
      };
    });

    const intermediateModel = tf.model({
      inputs: this.model.input,
      outputs: layerOutputs.map(l => l.output)
    });

    // Get intermediate activations
    const outputs = await intermediateModel.predict(input) as tf.Tensor[];
    
    // Process each layer's activation
    for (let i = 0; i < outputs.length; i++) {
      const layerName = layerOutputs[i].name;
      const activation = outputs[i];
      
      // Convert activation to number[][][] for visualization
      const activationData = await activation.array() as number[][][];
      
      activations.push({
        layerName,
        activation: activationData
      });

      activation.dispose();
    }

    return activations;
  }

  async recognizeCharacter(imageData: ImageData): Promise<RecognitionResult> {
    if (!this.model) {
      await this.loadModel();
    }

    if (!this.model) {
      throw new Error('Model failed to load');
    }

    // Use tf.tidy for tensor cleanup
    const input = await this.preprocessImage(imageData);
    
    try {
      // Get intermediate layer activations
      const layerActivations = await this.getIntermediateActivations(input);
      
      // Get final prediction
      const predictions = this.model.predict(input) as tf.Tensor;
      const predictionArray = await predictions.data();
      
      // Find the character with highest probability
      let maxIndex = 0;
      let maxProbability = predictionArray[0];
      
      for (let i = 1; i < predictionArray.length; i++) {
        if (predictionArray[i] > maxProbability) {
          maxProbability = predictionArray[i];
          maxIndex = i;
        }
      }
      
      // Get intermediate outputs for visualization
      const intermediateOutputs = await Promise.all(
        layerActivations.map(async (layer) => {
          if (layer.activation.length > 0) {
            return layer.activation[0]; // First channel/filter
          }
          return [];
        })
      );

      return {
        character: this.CHARACTER_MAP[maxIndex] || '?',
        probability: maxProbability,
        layerActivations,
        intermediateOutputs
      };
    } finally {
      // Cleanup tensors
      input.dispose();
    }
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

// Export singleton instance
export const recognitionService = new RecognitionService(); 