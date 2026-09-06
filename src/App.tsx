import React from 'react';
import { useBroaderStore } from './store/useBroaderStore';
import { BottomNav } from './components/BottomNav';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { HomeScreen } from './screens/HomeScreen';
import { FindRideScreen } from './screens/FindRideScreen';
import { ConfirmRideScreen } from './screens/ConfirmRideScreen';
import { BookRideScreen } from './screens/BookRideScreen';
import { RidesHistoryScreen } from './screens/RidesHistoryScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { WalletScreen } from './screens/WalletScreen';

export default function App() {
  const currentScreen = useBroaderStore((s) => s.currentScreen);

  // Determine which screen to render
  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'sign-in':
        return <SignInScreen />;
      case 'sign-up':
        return <SignUpScreen />;
      case 'find-ride':
        return <FindRideScreen />;
      case 'confirm-ride':
        return <ConfirmRideScreen />;
      case 'book-ride':
        return <BookRideScreen />;
      case 'wallet':
        return (
          <div className="flex flex-col min-h-screen justify-between relative">
            <div className="flex-1 pb-24">
              <WalletScreen />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNav />
            </div>
          </div>
        );
      case 'home':
        return (
          <div className="flex flex-col min-h-screen justify-between relative">
            <div className="flex-1 pb-24">
              <HomeScreen />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNav />
            </div>
          </div>
        );
      case 'rides':
        return (
          <div className="flex flex-col min-h-screen justify-between relative">
            <div className="flex-1 pb-24">
              <RidesHistoryScreen />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNav />
            </div>
          </div>
        );
      case 'chat':
        return (
          <div className="flex flex-col min-h-screen justify-between relative">
            <div className="flex-1 pb-24">
              <ChatScreen />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNav />
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col min-h-screen justify-between relative">
            <div className="flex-1 pb-24">
              <ProfileScreen />
            </div>
            <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
              <BottomNav />
            </div>
          </div>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <main id="app-root" className="min-h-screen w-full bg-[#F6F8FA] flex justify-center">
      <div id="app-viewport" className="w-full max-w-md min-h-screen bg-[#F6F8FA] relative flex flex-col">
        {renderScreen()}
      </div>
    </main>
  );
}
