## jquery-cx-poc-liferay-workspace

The Liferay workspace contains the liferay-sample-frontend client extension developed for Liferay DXP 2025.Q1 LTS or compatible releases. This extension is a custom element that utilizes the counterup2 jQuery plugin. It supports two scenarios:

- Global jQuery – If jQuery is enabled in Control Panel → System Settings → Third Party → jQuery, the client extension uses the globally available jQuery instance.

- Import Map – If global jQuery is not available, the client extension loads jQuery through an import map.
