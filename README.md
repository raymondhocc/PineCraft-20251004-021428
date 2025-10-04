# PineCraft: Pine Script™ Strategy Builder

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/PineCraft-20251004-021428)

PineCraft is a minimalist, single-page web application designed to streamline the process of modifying and testing TradingView Pine Script™ strategies. Users can paste their Pine Script™ code into a dedicated editor. The application intelligently parses the script to identify all `input()` variables (such as integers, floats, booleans, and strings). It then dynamically generates a clean, intuitive user interface with corresponding form controls—sliders for ranges, toggles for booleans, and text fields for strings. As the user adjusts these controls, the output script is updated in real-time, reflecting the new parameter values. This allows for rapid iteration and experimentation without manually editing the code. Once satisfied, the user can copy the modified script with a single click and paste it directly into the TradingView Pine Editor.

## Key Features

- **Automatic Parameter Detection:** Intelligently parses pasted Pine Script™ to find `input()` variables.
- **Dynamic UI Generation:** Creates sliders, switches, and text inputs based on the detected parameter types.
- **Real-Time Code Updates:** The output script is instantly updated as you adjust the UI controls.
- **One-Click Copy:** Easily copy the modified script to your clipboard.
- **Minimalist & Responsive:** A clean, two-panel layout that works beautifully on all devices.
- **Client-Side Processing:** All parsing and generation happens in your browser for speed and privacy.

## Technology Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Bun](https://bun.sh/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/pinecraft.git
    cd pinecraft
    ```

2.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running Locally

To start the development server, run the following command:

```sh
bun run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1.  Open the application in your web browser.
2.  Paste your Pine Script™ code into the "Source Code" text area on the left panel.
3.  The right panel will automatically populate with UI controls for each `input()` parameter found in your script.
4.  Adjust the values using the sliders, switches, and input fields.
5.  The "Output Code" block below the controls will update in real-time with your changes.
6.  Once you are satisfied with the configuration, click the "Copy Code" button.
7.  A notification will confirm that the code has been copied to your clipboard.
8.  Paste the modified script into your TradingView Pine Editor.

## Development

The core logic of the application is organized as follows:

-   `src/pages/HomePage.tsx`: The main entry point and layout container for the application.
-   `src/components/PineCraftCore.tsx`: Encapsulates the primary application logic, state management, and UI panels.
-   `src/hooks/usePineCraftStore.ts`: Defines the Zustand store for managing the application's state.
-   `src/lib/pine-parser.ts`: Contains the utility functions for parsing the Pine Script™ code using regular expressions.

## Deployment

This project is configured for easy deployment to Cloudflare Pages.

1.  **Log in to Cloudflare:**
    If you haven't already, log in to your Cloudflare account using the Wrangler CLI.
    ```sh
    npx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script to build and deploy your application.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/raymondhocc/PineCraft-20251004-021428)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request if you have a way to improve this project.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.