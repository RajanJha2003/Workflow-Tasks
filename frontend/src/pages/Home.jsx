import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

const Home = () => {
  const { userData, setUserData } = useContext(authDataContext);
  const isAdmin = userData?.role === "admin";





  const [showModal, setShowModal] = useState(false);
  const [workflowTasks, setWorkflowTasks] = useState([{ name: "", role: "" }]);
  const [workflowName, setWorkflowName] = useState("");
  const [workflows, setWorkflows] = useState([]);
  const [taskMap, setTaskMap] = useState({});
  const [viewTasks, setViewTasks] = useState({});
  const [users, setUsers] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/current-user", { withCredentials: true });
        setUserData(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);


  const fetchWorkflows = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workflow/workflows/my", {
        withCredentials: true,
      });
      setWorkflows(res.data.workflows);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/user/all-users", {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/tasks/my", {
        withCredentials: true,
      });
      setMyTasks(res.data.tasks);
    } catch (error) {
      console.error("Failed to fetch my tasks:", error);
    }
  };

  const fetchTasksForWorkflow = async (workflowId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/tasks/${workflowId}`, {
        withCredentials: true,
      });
      setTaskMap((prev) => ({ ...prev, [workflowId]: res.data.tasks }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMyTasks();

    if (isAdmin) {
      fetchWorkflows();
      fetchUsers();
    }
  }, [isAdmin]);

  const handleAddTask = () => {
    setWorkflowTasks((prev) => [...prev, { name: "", role: "" }]);
  };

  // Handle change in task name or role input
  const handleChangeTask = (index, field, value) => {
    setWorkflowTasks((prev) => {
      const newTasks = [...prev];
      newTasks[index][field] = value;
      return newTasks;
    });
  };

  const handleCreateWorkflow = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/workflow/workflows",
        { name: workflowName, tasks: workflowTasks },
        { withCredentials: true }
      );
      setShowModal(false);
      setWorkflowTasks([{ name: "", role: "" }]);
      setWorkflowName("");
      fetchWorkflows();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartWorkflow = async (workflowId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/workflow/workflows/start/${workflowId}`,
        {},
        { withCredentials: true }
      );
      fetchWorkflows();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskView = async (workflowId) => {
    const isVisible = viewTasks[workflowId];
    if (!isVisible && !taskMap[workflowId]) {
      await fetchTasksForWorkflow(workflowId);
    }
    setViewTasks((prev) => ({ ...prev, [workflowId]: !isVisible }));
  };

  const handleAssignUser = async (workflowId, taskId, userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/tasks/tasks/assign",
        { taskId, assigneeId: userId },
        { withCredentials: true }
      );
      await fetchTasksForWorkflow(workflowId);
      fetchMyTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/tasks/tasks/complete/${taskId}`,
        {},
        { withCredentials: true }
      );
      fetchMyTasks();
      if (isAdmin) fetchWorkflows();
    } catch (error) {
      console.error("Failed to complete task:", error.response?.data?.message || error.message);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      active: "bg-blue-100 text-blue-800 border-blue-200",
      complete: "bg-green-100 text-green-800 border-green-200",
      default: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return `px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || statusStyles.default}`;
  };


  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/user/logout", { withCredentials: true });
      setUserData(null);
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {userData?.name || 'User   '}!
              {isAdmin && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">Admin</span>}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </header>

        {/* Admin Section */}
        {isAdmin && (
          <section className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Workflow Management</h2>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Create Workflow
              </button>
            </div>

            {/* Workflows Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workflows.map((workflow) => {
                    const isExpanded = viewTasks[workflow._id];
                    const tasks = taskMap[workflow._id] || [];

                    return (
                      <React.Fragment key={workflow._id}>
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getStatusBadge(workflow.status)}>
                              {workflow.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            {workflow.status === "pending" && (
                              <button
                                onClick={() => handleStartWorkflow(workflow._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
                              >
                                Start
                              </button>
                            )}
                            <button
                              onClick={() => toggleTaskView(workflow._id)}
                              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
                            >
                              {isExpanded ? "Hide Tasks" : "View Tasks"}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr>
                            <td colSpan={3} className="px-6 py-4 bg-gray-50">
                              <div className="border border-gray-200 rounded-lg bg-white p-4">
                                <h4 className="font-medium text-gray-900 mb-3">Tasks for {workflow.name}</h4>
                                {tasks.length > 0 ? (
                                  <div className="space-y-3">
                                    {tasks.map((task) => (
                                      <div key={task._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                          <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-900">{task.name}</span>
                                            <span className={getStatusBadge(task.status)}>
                                              {task.status || "N/A"}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="ml-4 flex items-center">
                                          <span className="text-sm text-gray-600 mr-3">Assigned to:</span>
                                          {task.assignee ? (
                                            <div className="flex items-center space-x-2">
                                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-medium text-sm">
                                                  {(users.find((user) => user._id === task.assignee)?.name || "Unknown User").charAt(0)}
                                                </span>
                                              </div>
                                              <span className="text-sm font-medium text-gray-900">
                                                {users.find((user) => user._id === task.assignee)?.name || "Unknown User"}
                                              </span>
                                            </div>
                                          ) : (
                                            <select
                                              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                              onChange={(e) =>
                                                handleAssignUser(workflow._id, task._id, e.target.value)
                                              }
                                              defaultValue=""
                                            >
                                              <option value="" disabled>
                                                Select user...
                                              </option>
                                              {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                  {user.name} ({user.role})
                                                </option>
                                              ))}
                                            </select>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-gray-500">No tasks found for this workflow.</p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* My Tasks Section */}
        <section className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Tasks</h2>
          </div>
          <div className="p-6">
            {myTasks.length > 0 ? (
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{task.name}</h4>
                      <span className={getStatusBadge(task.status)}>
                        {task.status || "N/A"}
                      </span>
                    </div>
                    <div className="ml-4">
                      {task.status !== "complete" ? (
                        <button
                          onClick={() => handleCompleteTask(task._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          Complete Task
                        </button>
                      ) : (
                        <div className="flex items-center text-green-600 font-semibold">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">You have no assigned tasks currently.</p>
                <p className="text-gray-400 text-sm mt-1">Tasks will appear here when they're assigned to you.</p>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Create New Workflow</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter workflow name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                  />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {workflowTasks.map((task, i) => (
                      <div key={i}>
                        <input

                          placeholder={"Task Name"}
                          value={task.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => handleChangeTask(i, "name", e.target.value)}
                        />
                        <select
                          value={task.role}
                          onChange={(e) => handleChangeTask(i, "role", e.target.value)}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                        >
                          <option value="">Select Role</option>
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="worker">Worker</option>
                        </select>


                      </div>

                    ))}
                  </div>
                  <button
                    onClick={handleAddTask}
                    className="mt-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Add Another Task
                  </button>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkflow}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;