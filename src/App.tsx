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
import { RentalScreen } from './screens/RentalScreen';
import { ParcelScreen } from './screens/ParcelScreen';
import { FreightScreen } from './screens/FreightScreen';
import { AmbulanceScreen } from './screens/AmbulanceScreen';
import { BecomeDriverScreen } from './screens/BecomeDriverScreen';
import { DriverHomeScreen } from './screens/DriverHomeScreen';
import { DriverEarningsScreen } from './screens/DriverEarningsScreen';

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
      case 'rental':
        return <RentalScreen />;
      case 'parcel':
        return <ParcelScreen />;
      case 'freight':
        return <FreightScreen />;
      case 'ambulance':
        return <AmbulanceScreen />;
      case 'become-driver':
        return <BecomeDriverScreen />;
      case 'driver-home':
        return <DriverHomeScreen />;
      case 'driver-earnings':
        return <DriverEarningsScreen />;
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
    <main id="app-root" className="min-h-screen w-full bg-[#000000] text-white flex justify-center selection:bg-blue-500/30">
      <div id="app-viewport" className="w-full max-w-md min-h-screen bg-[#000000] text-white relative flex flex-col shadow-2xl border-x border-white/[0.06]">
        {renderScreen()}
      </div>
    </main>
  );
}
