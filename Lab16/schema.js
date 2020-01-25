const {
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');
const Db = require('./db/mssql-db');

async function getRecordsByField(object, field) {
    const fieldsMap = {};
    fieldsMap[object] = field;

    let records = [];
    if (field) {
        records = await db.getOne(object, fieldsMap);
    } else {
        records = await db.getAll(object);
    }
    return records;
}
async function mutateRecord(object, idField, fields) {

    return await getRecordsByField(object, idField)
        .then(async records => {
            let targetRecord = {};
            // If the record exists
            if (records.length > 0) {
                // Then update it and return updated variant
                targetRecord = await db.updateOne(object, fields)
                    .then(() => db.getOne(object, fields));
            } else {
                targetRecord = await db.insertOne(object, fields)
                    .then(() => db.getOne(object, fields));
            }
            return targetRecord[0];
        });
}
async function deleteRecord(object, id) {
    let recordIdObject = {};
    recordIdObject[object] = id;
    let targetFaculty = await db.getOne(object, recordIdObject);
    db.deleteOne(object, id);
    return targetFaculty[0];
}

const db = new Db();

const FacultyType = new GraphQLObjectType({
    name: 'FACULTY',
    description: 'FACULTY table',
    fields: () => ({
        FACULTY: { type: new GraphQLNonNull(GraphQLString) },
        FACULTY_NAME: { type: new GraphQLNonNull(GraphQLString) }
    })
});
const PulpitType = new GraphQLObjectType({
    name: 'PULPIT',
    description: 'PULPIT table',
    fields: () => ({
        PULPIT: { type: new GraphQLNonNull(GraphQLString) },
        PULPIT_NAME: { type: new GraphQLNonNull(GraphQLString) },
        FACULTY: { type: new GraphQLNonNull(GraphQLString) }
    })
});
const SubjectType = new GraphQLObjectType({
    name: 'SUBJECT',
    description: 'SUBJECT table',
    fields: () => ({
        SUBJECT: { type: new GraphQLNonNull(GraphQLString) },
        SUBJECT_NAME: { type: new GraphQLNonNull(GraphQLString) },
        PULPIT: { type: new GraphQLNonNull(GraphQLString) }
    })
});
const TeacherType = new GraphQLObjectType({
    name: 'TEACHER',
    description: 'TEACHER table',
    fields: () => ({
        TEACHER: { type: new GraphQLNonNull(GraphQLString) },
        TEACHER_NAME: { type: new GraphQLNonNull(GraphQLString) },
        PULPIT: { type: new GraphQLNonNull(GraphQLString) },
    })
});
const AuditoriumTypeType = new GraphQLObjectType({
    name: 'AUDITORIUM_TYPE',
    description: 'Auditorium Type table',
    fields: () => ({
        AUDITORIUM_TYPE: { type: new GraphQLNonNull(GraphQLString) },
        AUDITORIUM_TYPENAME: { type: new GraphQLNonNull(GraphQLString) },
    })
});
const AuditoriumType = new GraphQLObjectType({
    name: 'Auditorium',
    description: 'Auditorium table',
    fields: () => ({
        AUDITORIUM: { type: new GraphQLNonNull(GraphQLString) },
        AUDITORIUM_NAME: { type: new GraphQLNonNull(GraphQLString) },
        AUDITORIUM_CAPACITY: { type: new GraphQLNonNull(GraphQLString) },
        AUDITORIUM_TYPE: { type: new GraphQLNonNull(GraphQLString) }
    })
});

const UniversityRootType = new GraphQLObjectType({
    name: 'UniversityRoot',
    description: 'University Schema Query Root',
    fields: {
        getFaculties: {
            args: {
                FACULTY: { type: GraphQLString }
            },
            type: new GraphQLList(FacultyType),
            description: "List of all faculties",
            resolve: async (root, args) => await getRecordsByField('FACULTY', args.FACULTY)
        },
        getPulpits: {
            args: {
                PULPIT: { type: GraphQLString }
            },
            type: new GraphQLList(PulpitType),
            description: "List of all pulpits",
            resolve: async (root, args) => await getRecordsByField('PULPIT', args.PULPIT)
        },
        getSubjects: {
            args: {
                SUBJECT: { type: GraphQLString }
            },
            type: new GraphQLList(SubjectType),
            description: "List of all subjects",
            resolve: async (root, args) => await getRecordsByField('SUBJECT', args.SUBJECT)
        },
        getTeachers: {
            args: {
                TEACHER: { type: GraphQLString },
                FACULTY: { type: GraphQLString }
            },
            type: new GraphQLList(TeacherType),
            description: "List of all teachers",
            resolve: async (root, args) => {
                let res;
                if (args.FACULTY) {
                    const sql = `SELECT * FROM TEACHER t
                    INNER JOIN PULPIT p ON t.PULPIT = p.PULPIT
                    INNER JOIN FACULTY f ON p.FACULTY = f.FACULTY
                    WHERE p.FACULTY = '${args.FACULTY}'`
                    res = await db.simpleExecute(sql);
                } else {
                    res = getRecordsByField('TEACHER', args.TEACHER);
                }
                return res;
            }
        },
        getAuditoriumTypes: {
            args: {
                AUDITORIUM_TYPE: { type: GraphQLString },
            },
            type: new GraphQLList(AuditoriumTypeType),
            description: "List of all auditorium types",
            resolve: async (root, args) => await getRecordsByField('AUDITORIUM_TYPE', args.AUDITORIUM_TYPE)
        },
        getAuditoriums: {
            args: {
                AUDITORIUM: { type: GraphQLString },
            },
            type: new GraphQLList(AuditoriumType),
            description: "List of all auditoriums",
            resolve: async (root, args) => await getRecordsByField('AUDITORIUM', args.AUDITORIUM)
        },
    }
});
const UniversityMutationRootType = new GraphQLObjectType({
    name: 'UniversityMutationRoot',
    description: 'University Mutation Schema Query Root',
    fields: {
        setFaculty: {
            type: FacultyType,
            args: {
                FACULTY: { type: new GraphQLNonNull(GraphQLString) },
                FACULTY_NAME: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args) => {
                return mutateRecord('FACULTY', args.FACULTY, args);
            }
        },
        setPulpit: {
            type: PulpitType,
            args: {
                PULPIT: { type: new GraphQLNonNull(GraphQLString) },
                PULPIT_NAME: { type: new GraphQLNonNull(GraphQLString) },
                FACULTY: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (root, args) => {
                return mutateRecord('PULPIT', args.PULPIT, args);
            }
        },
        setSubject: {
            type: SubjectType,
            args: {
                SUBJECT: { type: new GraphQLNonNull(GraphQLString) },
                SUBJECT_NAME: { type: new GraphQLNonNull(GraphQLString) },
                PULPIT: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (root, args) => {
                return mutateRecord('SUBJECT', args.SUBJECT, args);
            }
        },
        setTeacher: {
            type: TeacherType,
            args: {
                TEACHER: { type: new GraphQLNonNull(GraphQLString) },
                TEACHER_NAME: { type: new GraphQLNonNull(GraphQLString) },
                PULPIT: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (root, args) => {
                let fields = { TEACHER: args.TEACHER, TEACHER_NAME: args.TEACHER_NAME, PULPIT: args.PULPIT };
                return mutateRecord('TEACHER', fields.TEACHER, fields);
            }
        },

        delFaculty: {
            type: FacultyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args) => deleteRecord('FACULTY', args.id)
        },
        delPulpit: {
            type: PulpitType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args) => deleteRecord('PULPIT', args.id)
        },
        delSubject: {
            type: SubjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args) => deleteRecord('SUBJECT', args.id)
        },
        delTeacher: {
            type: TeacherType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (root, args) => deleteRecord('TEACHER', args.id)
        }
    }
});

const UniversitySchema = new GraphQLSchema({
    query: UniversityRootType,
    mutation: UniversityMutationRootType
});

module.exports = UniversitySchema;
