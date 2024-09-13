default:
	podman run -p 8000:8000 --rm -it $$(podman build -q .)
