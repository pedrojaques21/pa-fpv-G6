# PA-FPV-G6

Welcome to the **PA-FPV-G6**! This is the third pratical project for the Advanced Programming subject, where our group was proposed to develop a simple project that demonstrate the knowledge acquired during the last Advanced Programming module. Thus it was proposed to deliver a project in JavaScript and HTML that uses the WebGL library to implement the visualization described below. 

Specifically it was expected to use: 

- Graphic transformations with matrices 
- Use of textures 
- Animations 
- Implementation of shaders 
- Editing and implementing light sources.
- Loading 3D models

<ins>Alternatively we could use the Three.js library to implement the proposed problem.</ins>

## Table of Contents
- [Project Description](#project-description)
- [Project Detailed Description](#project-detailed-description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Project Description

The proposed project, defined hereafter as "pa-fpv", aims to create a visualization of a random 3D scene, based on the requirements listed in [Project Detailed Description](#project-detailed-description).

## Project Detailed Description

The proposed visualization for "pa-fpv" should should have a canvas of 800 by 600 pixels.

1. In this canvas a random value between 5 and 30 objects should be placed. 
2. These objects should be of the following types: 

   a. Cubes, where each face has a random color, and a random size of the sides between 0.1 and 0.5 units.

   b. Triangular pyramids, in which each face has a random color, and a random dimension of the edges between 0.1 and 0.5 units.

   c. In generating the objects there should be a 50% probability that they have a texture to be defined by each group.

   d. All objects should be randomly animated (rotated) once they are in the scene.

   e. Both cubes and pyramids have the same probability of being placed in the canvas.
3. All objects should be randomly placed in the scene, respecting the following coordinates: 

   a. -10 to 10 for the xx's axis.

   b. -1 to 1 for the yy's axis. 
   
   c. -10 to 10 for the zz's axis.
4. It should be possible to add light sources to the scene (via an HTML form) a. It should be possible for the user to identify the type of source, its direction and intensity.
5. As a last requirement it should be possible for the user to scroll through the scene in the first person
using the 'W', 'A', 'S', 'D' keys.

## Installation

To install our project all it's needed is to clone the git repository, move into the project directory, install Vite node module globally to serve the files and install the node modules needed to run the project.

```bash
$ git clone https://github.com/pedrojaques21/pa-fpv-G6
# Move in to the project directory
$ npm i
$ npm i vite -g
```

## Usage

To run our project all you need to do is to run the command to start serving the files and open your favorite browser (we recommend Google Chrome) to test the project.

Inside the browser it will be given some instructions on how to use the project.

```bash
#   Inside the root directory of the project
$ vite src
```

## Features

In our 

- [Project Description](#project-description)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)