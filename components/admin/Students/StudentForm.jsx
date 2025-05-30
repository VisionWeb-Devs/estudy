"use client";
import { FiPlus, FiX, FiSave, FiEye, FiEyeOff } from "react-icons/fi";
import { useState, useEffect } from "react";

const StudentForm = ({
  projects,
  modules, // <-- Add this prop
  setShowAddForm,
  handleAddStudent,
  initialStudent = {
    id: null,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    department: "cs",
    assignedModules: [], // <-- Add default
  },
}) => {
  const [formData, setFormData] = useState({
    ...initialStudent,
    wishlist: [],
    assignedModules: initialStudent.assignedModules || [], // <-- Track assigned modules
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  console.log(modules)

  useEffect(() => {
    setFormData({
      ...initialStudent,
      wishlist: initialStudent.id ? initialStudent.wishlist : [],
      assignedModules: initialStudent.id ? (initialStudent.assignedModules || []) : [],
    });
    setFormErrors({});
  }, [initialStudent.id]);

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) errors.first_name = "First Name is required";
    if (!formData.last_name.trim()) errors.last_name = "Last Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Valid email is required";
    }
    if (!initialStudent.id && !formData.password) {
      errors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setFormData((prev) => ({
      ...prev,
      department,
    }));
  };

  const handleWishlistChange = (e) => {
    const { value } = e.target;
    if (formData.wishlist.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        wishlist: prev.wishlist.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        wishlist: [...prev.wishlist, value]
      }));
    }
  }

  // Add handler for module assignment
  const handleModuleAssignmentChange = (e) => {
    const moduleId = e.target.value;
    setFormData((prev) => {
      const alreadyAssigned = prev.assignedModules.includes(moduleId);
      return {
        ...prev,
        assignedModules: alreadyAssigned
          ? prev.assignedModules.filter((id) => id !== moduleId)
          : [...prev.assignedModules, moduleId],
      };
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const studentData = {
        ...formData,
        assignedModules: formData.assignedModules, // Ensure this is sent
      };

      await handleAddStudent(studentData);
      setShowAddForm(false);
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialStudent.id ? "Edit Student" : "Add New Student"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.first_name ? "border-red-500" : "border-gray-300"
                }`}
              value={formData.first_name}
              onChange={handleChange}
              minLength={3}
              maxLength={50}
            />
            {formErrors.first_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.last_name ? "border-red-500" : "border-gray-300"
                }`}
              value={formData.last_name}
              onChange={handleChange}
              minLength={3}
              maxLength={50}
            />
            {formErrors.last_name && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.last_name}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {initialStudent.id ? "New Password" : "Password *"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.password || ""}
                onChange={handleChange}
                minLength={6}
                maxLength={50}
                placeholder={
                  initialStudent.id ? "Leave blank to keep current" : ""
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
            {initialStudent.id && (
              <p className="mt-1 text-xs text-gray-500">
                Only enter if you want to change the password
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              name="department"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.department}
              onChange={handleDepartmentChange}
            >
              <option value="cs">Computer Science</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
            </select>
          </div>
        </div>

        {/* Module Assignment Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign Modules
          </label>
          <div className="flex flex-wrap gap-3">
            {modules && modules.length > 0 ? (
              modules.map((mod) => (
                <label key={mod.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={mod.id}
                    checked={formData.assignedModules.includes(mod.id)}
                    onChange={handleModuleAssignmentChange}
                  />
                  <span>{mod.title}</span>
                </label>
              ))
            ) : (
              <span className="text-gray-500">No modules available</span>
            )}
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors duration-200 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            <FiSave className="inline mr-2" />
            {isSubmitting
              ? "Processing..."
              : initialStudent.id
                ? "Update Student"
                : "Add Student"}
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center transition-colors duration-200"
          >
            <FiX className="inline mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
