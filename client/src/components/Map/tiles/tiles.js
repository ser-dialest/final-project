import grassImg from "./Grass3.png"
import mountainImg from "./Mountain3.png";
import buildingImg from "./Building3.png";
import forestImg from "./Forest3.png";

export const grass = {
    image: grassImg,
    defense: 1,
    travelCost: 0
};

export const mountain = {
    image: mountainImg,
    defense: 0,
    travelCost: 1
};

export const building = {
    image: buildingImg,
    defense: 0,
    travelCost: 1
};

export const forest = {
    image: forestImg,
    defense: 2,
    travelCost: 0
};
