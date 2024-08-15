# Job Listing App

A React Native application for browsing and managing job listings. Users can bookmark jobs and view detailed information on each job. The app supports offline viewing of bookmarks and updates in real-time.

## Features

- Browse job listings with infinite scrolling.
- Bookmark jobs for later reference.
- View detailed information of each job in a full-screen modal.
- Dark mode design.
- Real-time updates with automatic polling.

## Prerequisites

- Node.js (>= 14.x)
- Expo CLI (>= 5.x)
- React Native development environment

## Installation

### Clone the Repository

```bash
git clone https://github.com/Prince0000/jobApp.git
cd job-listing-app
```

### Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### Install Expo CLI

If you don’t have Expo CLI installed, install it globally using:

```bash
npm install -g expo-cli
```

or

```bash
yarn global add expo-cli
```

## Setup

### Configure Database (For Offline Bookmarking)

This app uses `localStorage` for storing bookmarks. No additional configuration is needed for the database.

### Running the App

To start the development server and run the app, use:

```bash
expo start
```

This command will open a browser window where you can run the app on an emulator or a physical device using the Expo Go app.

## Usage

1. **Browse Jobs**: Navigate through the list of jobs with infinite scrolling.
2. **Bookmark Jobs**: Click the bookmark icon on a job to add it to your bookmarks.
3. **View Job Details**: Tap on a job card to view detailed information in a full-screen modal.
4. **Manage Bookmarks**: Access the Bookmarks tab to see all your bookmarked jobs.

## Screenshots

![Home Screen](https://drive.google.com/file/d/1nz33CRx_zNT2412KcMD4daLwfUN3BiWc/view?usp=sharing)
![Job Details](https://drive.google.com/file/d/1o5s9FfIvWSbtU7fBg7w_niFBMCGtff1V/view?usp=sharing)
![Bookmarks](https://drive.google.com/file/d/1o2apU6RqCHFUqrEtmlNeaVizQeWg2YuW/view?usp=sharing)

## Code Structure

- `app/`: Contains the main application code.
  - `tabs/`: Contains tab-based screens.
    - `HomeScreen.tsx`: The screen that displays job listings.
    - `BookmarkScreen.tsx`: The screen that displays bookmarked jobs.
  - `components/`: Contains reusable UI components.
    - `ThemedText.tsx`: Custom text component for consistent styling.
  - `helpers/`: Contains utility functions.
    - `BookmarkHelper.ts`: Functions for managing bookmarks.

## Troubleshooting

- **`expo-sqlite` not found**: Ensure you have installed `expo-sqlite` using `expo install expo-sqlite`. For localStorage, make sure you are using `AsyncStorage` from `@react-native-async-storage/async-storage`.

- **Key errors in FlatList**: Ensure each item in your FlatList has a unique key by using `item.id.toString()` in the `keyExtractor`.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Commit your changes: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React Native](https://reactnative.dev/) - Framework used for building the mobile app.
- [Expo](https://expo.dev/) - Development framework for React Native.
