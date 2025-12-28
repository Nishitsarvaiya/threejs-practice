import './style.css';
import App from './App';

// Helper to ensure DOM is ready
const awaitDom = () => {
	return new Promise((resolve) => {
		if (document.readyState !== 'loading') resolve();
		else document.addEventListener('DOMContentLoaded', resolve);
	});
};

let appInstance = null;

try {
	// Wait for resources
	await Promise.all([awaitDom(), document.fonts.ready]);

	// Init App
	if (appInstance) appInstance.destroy();

	const dom = document.getElementById('app');
	appInstance = new App({ dom });

	window.APP = appInstance;
} catch (err) {
	console.error('App Initialisation Failed :: ', err);
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		if (appInstance) appInstance.destroy();
	});
}
