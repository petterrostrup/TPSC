This is the implementation for the Tiered-Priority Swarm Computing (TPSC)

DISCLAIMER: Not currently tested too much other than through development. Cannot guarantee functioning system on your home system without some tweaking

Linux install (currently only supported)
How-To:
1. Install docker, docker-compose, python3.
2. Clone this repo and change directory into it
3. Set up docker swarm (https://docs.docker.com/engine/swarm/swarm-mode/)
4. Set up docker registry (https://docs.docker.com/engine/swarm/stack-deploy/)
5. something
6. Build the images: Use command "docker-compose build"
7. Test with "docker-compose up"
8. Now it should be working on your local machine. Go to http://localhost:8080/ for WebApp.
9. Use "docker-compose down" to prepare for stack deploy.
10. Use "docker-compose push" to push images to registry.
11. Use "docker stack deploy --compose-file docker-compose.yml tpsc" to deploy the stack
12. Now it should be working in the swarm. Go to http://localhost:8080/ for WebApp.