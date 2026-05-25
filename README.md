# smartpreview
# SmartPreview

A highly premium and state-of-the-art real-time code previewer. SmartPreview reinvents the development workflow by providing instant visual feedback as you type.

## ✨ Features

-   **Real-time Code Preview**: See your changes instantly without refreshing.
-   **Rich Text Editor**: Built with [TipTap](https://tiptap.dev/), offering a premium writing experience.
-   **Code Rendering**: Seamless integration for code blocks with syntax highlighting.
-   **Themeable Interface**: Modern design with light and dark mode support.
-   **Responsive Design**: Beautiful UI that works on any device.
-   **Next.js Performance**: Built on the latest Next.js framework for optimal performance.
-   **Modern Stack**: Leveraging Tailwind CSS for styling and Framer Motion for animations.

## 🚀 Getting Started

These instructions will help you get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or higher)
-   [npm](https://www.npmjs.com/) (or yarn/pnpm)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd smartpreview
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 🏗️ Architecture

The application is built with:

-   **[Next.js 16](https://nextjs.org/)**: React framework for production.
-   **[React 19](https://react.dev/)**: JavaScript library for building user interfaces.
-   **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework.
-   **[TipTap Editor](https://tiptap.dev/)**: Headless editor framework for web.
-   **[Framer Motion](https://www.framer.com/motion/)**: React animation library.
-   **[Shadcn UI](https://ui.shadcn.com/)**: Component library for building beautiful UIs.

## 🗺️ Project Structure

```
smartpreview/
├── app/                # Next.js App Router pages and components
├── components/         # Reusable UI components
│   ├── common/         # General purpose components
│   ├── editor/         # Editor specific components (Toolbars, etc.)
│   └── layout/         # Layout components (Navbar, Footer)
├── features/           # Feature-specific modules
│   └── code-preview/   # Core code preview functionality
├── lib/                # Utility functions and helpers
├── public/             # Static assets
├── styles/             # Global styles and themes
└── utils/              # Utility functions
```

## 🛠️ Development

### Customization

-   **Themes**: Edit variables in `styles/globals.css` or `components/ui/theme.ts` to customize the look and feel.
-   **Components**: Extend components in the `components/` directory.

### Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the production application. |
| `npm run start` | Runs the compiled production application. |
| `npm run lint` | Lints the codebase for errors. |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Laolu Ajibade**

-   Portfolio: [ajibadde.space](https://ajibadde.space)
-   Email: [laoluajibadee@gmail.com](mailto:[EMAIL_ADDRESS])

## 🙏 Acknowledgments

-   [Next.js](https://nextjs.org/) for the amazing framework.
-   [TipTap](https://tiptap.dev/) for the powerful editor.
-   [Tailwind CSS](https://tailwindcss.com/) for making styling fun.
-   [Shadcn UI](https://ui.shadcn.com/) for the beautiful components.
