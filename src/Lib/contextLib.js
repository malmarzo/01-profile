// AppContext.js
// A class to manage the application's global state
let authenticated = false;
if (localStorage.getItem("jwtToken")) {
    authenticated = true;
}
class AppContext {
  constructor() {
    this.state = {
      isAuthenticated: authenticated,
    };
    this.listeners = new Set(); // Subscribers to state changes
  }

  // Method to get the current state
  getState() {
    return this.state;
  }

  // Method to update state and notify listeners
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // Subscribe a listener to state changes
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // Return unsubscribe function
  }

  // Notify all listeners of state changes
  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

export function handleAuthChange(state) {
  console.log("Authentication state changed:", state.isAuthenticated);
}

// Singleton instance of AppContext
export const appContext = new AppContext();
