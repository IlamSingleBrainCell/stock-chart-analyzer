# Stock Chart Analyzer

## Project Description

Stock Chart Analyzer is a React application designed to help users identify common stock chart patterns from an uploaded image and provide a (currently simulated) prediction of future price trends. This tool is intended for educational purposes to help users learn about technical analysis and chart patterns.

Please note: The current version of the application uses a mock analysis to simulate pattern detection and prediction.

## Features

- **Upload Stock Chart Images:** Users can upload images of stock charts directly into the application.
- **Chart Pattern Analysis (Simulated):** The application identifies common chart patterns from the uploaded image. (Note: This analysis is currently simulated).
- **Trend Prediction:** Based on the detected pattern, the tool predicts whether the stock is likely to go up, down, or continue its current trend.
- **Estimated Timeframe:** Provides an estimated timeframe for the predicted trend.
- **Pattern Descriptions:** Offers descriptions of various common chart patterns to help users understand the analysis.

## How to Use

1.  **Upload Image:** Click on the "Upload Stock Chart Image" section or drag and drop an image file of a stock chart.
2.  **Analyze Chart:** Once the image is uploaded and a preview is visible, click the "Analyze Chart Pattern" button.
3.  **View Results:** The application will display:
    *   The detected chart pattern (e.g., Head and Shoulders, Double Bottom).
    *   A prediction of the likely price trend (Up, Down, or Continuation).
    *   An estimated timeframe for this prediction.
    *   A description of the detected pattern.

## Disclaimer

**Important:** This tool is for educational purposes only. Stock predictions are not guaranteed and should not be used as investment advice.

This application does not provide financial advice. Chart pattern recognition is subjective and past patterns do not guarantee future results. Always conduct your own research before making investment decisions.

## Running the Project Locally

To run the Stock Chart Analyzer on your local machine, follow these steps:

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <repository-url>
    cd stock-chart-analyzer
    ```
2.  **Install dependencies:**
    Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```
3.  **Start the development server:**
    After the installation is complete, run:
    ```bash
    npm start
    ```
    This will open the application in your default web browser, usually at `http://localhost:3000`.

## Deployment

This project is set up for deployment to GitHub Pages.

-   **Build the project:** `npm run build`
-   **Deploy to GitHub Pages:** `npm run deploy`

The live version of this application can be accessed at:
[https://IlamSingleBrainCell.github.io/stock-chart-analyzer](https://IlamSingleBrainCell.github.io/stock-chart-analyzer)

## Attribution

Developed by Ilam.
