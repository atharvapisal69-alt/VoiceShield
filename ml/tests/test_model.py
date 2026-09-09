from pathlib import Path
import sys

# Add ml folder to Python path
ML_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ML_DIR))

from app.inference import VoiceShieldDetector


def main():
    print("=" * 50)
    print("VoiceShield ML Model Test")
    print("=" * 50)

    try:
        detector = VoiceShieldDetector()

        print("Model loaded successfully!")
        print(f"Model path: {detector.model_path}")
        print(f"Input name: {detector.input_name}")
        print(f"Output name: {detector.output_name}")

        print("\nModel Input Details:")
        for model_input in detector.session.get_inputs():
            print(
                f"  Name: {model_input.name}\n"
                f"  Shape: {model_input.shape}\n"
                f"  Type: {model_input.type}"
            )

        print("\nModel Output Details:")
        for model_output in detector.session.get_outputs():
            print(
                f"  Name: {model_output.name}\n"
                f"  Shape: {model_output.shape}\n"
                f"  Type: {model_output.type}"
            )

        print("\nVoiceShield model is ready!")

    except Exception as e:
        print("\nError loading model:")
        print(e)


if __name__ == "__main__":
    main()