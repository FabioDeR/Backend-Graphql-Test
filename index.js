const { ApolloServer } = require("apollo-server");
const cours = require("./includes/course");
const instructors = require("./includes/instructors");

const typeDefs = `
            enum Categories {
                WEB
                GAME
                OTHER
            }

            type Course {
                id:ID
                name:String
                description:String
                image:String
                price:Int
                category: Categories
                postedBy : Instructors
            }

            type Instructors {
                id: ID
                firstName: String
                lastName: String
                website: String
                image: String
                title: String
                postedCourses:[Course]
            }
            
            input CourseInput{
                id:ID
                name: String!
                description:String
                price:Int!
                category:Categories
            }

            type Query {
                hello : String!
                totalCourses:Int!
                totalInstructors:Int!
                allCourses:[Course]!
                allInstructors:[Instructors]!
            }
            type Mutation {
                postCourse(input :CourseInput! ) : Course!
            }
`;

var _id = 5;
const resolvers = {
  Query: {
    hello: () => "Hello ! l'api fonctionne",
    totalCourses: () => cours.cours.length,
    totalInstructors: () => instructors.instructors.length,
    allCourses: () => cours.cours,
    allInstructors: () => instructors.instructors,
  },
  Mutation: {
    postCourse(_, args) {
      let newCourse = {
        id: _id++,
        ...args.input,
      };
      cours.cours.push(newCourse);
      return newCourse;
    },
  },
  Course: {
    postedBy: (_) => {
      return instructors.instructors.find((i) => i.firstName === _.instructor);
    },
  },
  Instructors: {
    postedCourses: (_) => {
      let coursList = [];
      cours.cours.forEach((c) => {
        if (c.instructor === _.id) {
          coursList.push(c);
        }
      });
      return coursList;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => {
    console.log(`API running on ${url}`);
  })
  .catch((error) => console.log(error));

/**curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"# Write your query or mutation here\nquery getCourses {\n  allCourses {\n    id\n    name\n    image\n  }\n}\n"}' --compressed */
/**curl 'http://localhost:4000/' -H 'Accept-Encoding: gzip, deflate, br' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Connection: keep-alive' -H 'DNT: 1' -H 'Origin: http://localhost:4000' --data-binary '{"query":"# Write your query or mutation here\nquery getCourses {\n  allCourses {\n    id\n    name\n  }\n}\n"}' --compressed */
