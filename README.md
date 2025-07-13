# Stock Chart Analyzer

## Project Description

Stock Chart Analyzer is a sophisticated React application designed to empower users with tools for technical analysis of stock charts. It offers both real-time data analysis and educational resources to help users identify common chart patterns and make informed decisions. This tool is intended for educational and informational purposes.

**Live Application:** [https://IlamSingleBrainCell.github.io/stock-chart-analyzer](https://IlamSingleBrainCell.github.io/stock-chart-analyzer)

## Features

-   **Live Stock Chart Analysis:** Fetch and analyze real-time stock data for a wide range of tickers from US and Indian markets.
-   **Advanced Pattern Recognition:** Automatically detects common chart patterns such as Head and Shoulders, Double Tops/Bottoms, Triangles, and more.
-   **Data-Driven Predictions:** Provides predictions on future price trends (Up, Down, Continuation) based on detected patterns.
-   **Confidence Score:** Each analysis comes with a confidence score to indicate the reliability of the detected pattern.
-   **Key Level Identification:** Automatically identifies key support and resistance levels.
-   **Breakout Timing:** Estimates the potential timing for a stock to break out from its current pattern.
-   **Long-Term Assessment:** Analyze long-term trends with data ranging from 3 months to 10 years.
-   **Educational Game:** A "Pattern Recognition Game" to help users sharpen their skills in identifying chart patterns.
-   **Image Upload:** Users can upload their own stock chart images for educational exploration.
-   **Themeable Interface:** Switch between light and dark modes for comfortable viewing.

## How to Use

1.  **Select Analysis Mode:**
    *   **Live Analysis (Recommended):** Use the search bar to find a stock by its ticker symbol (e.g., `AAPL`, `TCS.NS`) or company name. The application supports a vast database of US and Indian stocks.
    *   **Image Upload:** Alternatively, upload an image of a stock chart from your local files for educational analysis.
2.  **Fetch and Analyze:**
    *   For live analysis, select the desired time range (3 months, 1 year, 5 years, or 10 years) and click "Get Chart".
    *   For uploaded images, click "Analyze Chart Pattern" after the image preview is visible.
3.  **View Comprehensive Results:** The application will display a detailed analysis, including:
    *   The detected chart pattern and its description.
    *   A prediction of the likely price trend.
    *   The confidence level of the analysis.
    *   Key support and resistance levels.
    *   An estimated timeframe for the prediction and breakout timing.
    *   A recommendation (Buy, Sell, Hold) based on the analysis.

## Technologies Used

-   **Frontend:** React, React Hooks, Context API
-   **Charting:** HTML5 Canvas
-   **Styling:** CSS-in-JS, with support for light and dark themes
-   **Icons:** Lucide React
-   **Deployment:** GitHub Pages

## Running the Project Locally

To run the Stock Chart Analyzer on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IlamSingleBrainCell/stock-chart-analyzer.git
    cd stock-chart-analyzer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm start
    ```
    This will open the application in your default web browser, usually at `http://localhost:3000`.

## Disclaimer

**Important:** This tool is for educational and informational purposes only. The analysis and predictions provided are not financial advice. Stock market investments are subject to market risks, and past performance is not indicative of future results. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.

## Attribution

Developed by Ilam. The project leverages advanced AI for pattern recognition to enhance the analysis.
