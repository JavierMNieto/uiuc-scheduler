import { createContext, useContext, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_COURSE":
      state.push(action.course);
      return state;
    case "REMOVE_COURSE":
      state.splice(action.index, 1);
      return state;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
};

const WorkspaceStateContext = createContext();
const WorkspaceDispatchContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <WorkspaceDispatchContext.Provider value={dispatch}>
      <WorkspaceStateContext.Provider value={state}>
        {children}
      </WorkspaceStateContext.Provider>
    </WorkspaceDispatchContext.Provider>
  );
};

export const useSemesters = () => useContext(WorkspaceStateContext);
export const useDispatchSemesters = () => useContext(WorkspaceDispatchContext);
