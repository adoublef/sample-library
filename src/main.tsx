import { render } from 'preact';
import { StrictMode } from 'preact/compat';
import { App } from './app';
import './index.css';

render(<StrictMode><App /></StrictMode>, document.getElementById('app') as HTMLElement);
