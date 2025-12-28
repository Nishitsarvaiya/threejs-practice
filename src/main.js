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
	const dom = document.getElementById('app');
	window.APP = new App({ dom });
} catch (err) {
	console.error(err);
}
