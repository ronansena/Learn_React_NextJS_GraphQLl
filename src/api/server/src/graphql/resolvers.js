import {fileLoader,mergeResolvers} from "merge-graphql-schemas";
import path from "path";

const resolversArray = fileLoader(path.join(__dirname,'modules','**',"resolvers.js"));

const resolvers = mergeResolvers(resolversArray);

//console.log("resolversArray");
//console.log(resolversArray);

export default resolvers;