import './style.css';
import App from './App';

// Helper to ensure DOM is ready
const awaitDom = () => {
	return new Promise((resolve) => {
		if (document.readyState !== 'loading') resolve();
		else document.addEventListener('DOMContentLoaded', resolve);
	});
};

try {
	// Wait for resources
	await Promise.all([awaitDom(), document.fonts.ready]);

	// Init App
	window.APP = new App();
} catch (err) {
	console.error(err);
}
