Solution for the Knowledge Based Systems task, problem proposed by Prof. dr. ing. GROZA Adrian from Technical University of Cluj-Napoca.  

#### Problem - Display an ontology (owl or ttl) as a knowledge graph in a web interface 
* one example https://www.youtube.com/watch?v=tUwNHOY7OHw
* Task 2.1 Displaying and navigating the knowledge graphs suffices (no graphs, or time bars etc)
* Task 2.2 Deploy a running version of the web page

#### Features
* Select default ttl file or upload your own
* Filter the nodes by name
* Number of nodes around the target node. The search algorithm is based on BFS, so nodes will be searched in a circular way
* View the ontology
* Select new nodes as root for ontology display

#### Installation
* Ensure that Docker service is running
* Fetch the ontology display from web:
~~~bash
docker pull tavisit/ontology-graph:master
~~~
* Deploy it:
~~~bash
docker run -p 3000:3000 --name ontology-display tavisit/ontology-graph:master
~~~
* Now the application is hosted at __localhost:3000__:
  
#### Update the docker image:
  * Pull the latest version of the image
    ~~~bash
    docker pull tavisit/ontology-graph:master
    ~~~
  * List your currently running containers (to find the one you need to update)
    ~~~bash
    docker ps
    ~~~
  * Stop the running container (replace container_id with the actual container ID from the previous step)
    ~~~bash
    docker stop container_id
    ~~~
  * Remove the stopped container (to free up the name/port and avoid conflicts)
    ~~~bash
    docker rm container_id
    ~~~
  * Run a new container with the updated image
    ~~~bash
    docker run -p 3000:3000 --name ontology-display tavisit/ontology-graph:master
    ~~~
