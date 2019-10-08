export const stateMachine = {
  initial: "unknown",

  states: {
    unknown: {
      ON: {
        "@__tests__": {
          testType: "oneOf",
          tests: [
            {
              cond: "hasValue",
              target: "filled",
            },

            {
              cond: "hasNoValue",
              target: "empty",
            },
          ],
        },
      },
    },

    filled: {
      context: {
        value: "string",
        url: "string",
      },

      initial: "preview",

      states: {
        preview: {
          ON: {
            EDIT_INIT: "editing",
          },
        },

        editing: {
          initial: "initial",

          states: {
            initial: {
              ON: {
                START_PHOTO_DELETE: "startPhotoDelete",
                CHANGE_PHOTO: "#preview",
                PREVIEW: "preview",
              },
            },

            startPhotoDelete: {
              DELETE_PHOTO: "#empty",
              STOP_PHOTO_DELETE: "initial",
            },
          },
        },
      },
    },

    empty: {
      ON: {
        CHANGE_PHOTO: "preview",
      },
    },
  },
};
