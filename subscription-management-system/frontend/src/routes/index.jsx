import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

/**
 * Application Routes Definition.
 * As features are developed, page components from pages/* will be mounted here.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  }
]);
