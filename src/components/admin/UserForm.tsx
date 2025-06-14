// src/components/forms/UserForm.tsx
import { Component, ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
// Update the path below to the correct location of your store file
// Update the path below to the correct location of your store file
import { AppDispatch } from '../../app/store';
import { addUser, updateUser } from '../../features/users/userSlice';
import { User } from '../../types';
import { X } from 'lucide-react';

interface Props {
  mode: 'add' | 'edit';
  initialData: User | null;
  onCancel: () => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
}

interface State {
  formData: User;
}

class UserForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      formData: props.initialData || {
        studentid: '',
        firstname: '',
        middlename: '',
        lastname: '',
        gender: 'Male',
        baptismalname: '',
        phone: '',
        birthdate: '',
        useremail: '',
        nationality: 'Ethiopian',
        regionnumber: '',
        mothertongue: '',
        zonename: '',
        disabled: false,
        universityusers: {
          departmentname: '',
          sponsorshiptype: 'Government',
          participation: 'Active',
          batch: '',
          confessionfather: null,
          advisors: '',
          role: 'Faithful',
          mealcard: null,
          cafeteriaaccess: false,
        },
      },
    };
  }

  handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      checked = e.target.checked;
    }
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      this.setState(prev => ({
        formData: {
          ...prev.formData,
          [parent]: {
            ...((prev.formData[parent as keyof User] || {}) as object),
            [child]: type === 'checkbox' ? checked : value,
          },
        },
      }));
    } else {
      this.setState(prev => ({
        formData: {
          ...prev.formData,
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
    }
  };

  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { mode, addUser, updateUser } = this.props;
    const { formData } = this.state;

    if (mode === 'add') {
      addUser(formData);
    } else {
      updateUser(formData);
    }
  };

  render() {
    const { onCancel, mode } = this.props;
    const { formData } = this.state;

    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {mode === 'add' ? 'Add User' : 'Edit User'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={this.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['studentid', 'Student ID'],
              ['firstname', 'First Name'],
              ['middlename', 'Middle Name'],
              ['lastname', 'Last Name'],
              ['baptismalname', 'Baptismal Name'],
              ['phone', 'Phone'],
              ['birthdate', 'Birthdate'],
              ['useremail', 'Email'],
              ['regionnumber', 'Region Number'],
              ['mothertongue', 'Mother Tongue'],
              ['zonename', 'Zone Name'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={key === 'birthdate' ? 'date' : 'text'}
                  name={key}
                  value={(formData as any)[key]}
                  onChange={this.handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="disabled"
                checked={formData.disabled}
                onChange={this.handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Disabled</label>
            </div>
          </div>

          <h4 className="text-md font-semibold pt-6">University Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['departmentname', 'Department'],
              ['batch', 'Batch'],
              ['advisors', 'Advisors'],
              ['mealcard', 'Meal Card'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  name={`universityusers.${key}`}
                  value={(formData.universityusers as any)[key]}
                  onChange={this.handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Type</label>
              <select
                name="universityusers.sponsorshiptype"
                value={formData.universityusers?.sponsorshiptype ?? ''}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Participation</label>
              <select
                name="universityusers.participation"
                value={formData.universityusers?.participation ?? ''}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Active">Active</option>
                <option value="Passive">Passive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="universityusers.role"
                value={formData.universityusers?.role ?? ''}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Faithful">Faithful</option>
                <option value="Administrator">Administrator</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                name="universityusers.cafeteriaaccess"
                checked={formData.universityusers?.cafeteriaaccess ?? false}
                onChange={this.handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Cafeteria Access</label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

// Connect Redux actions
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addUser: (user: User) => dispatch(addUser(user)),
  updateUser: (user: User) => {
    if (!user.id) {
      throw new Error('User id is required for updating a user.');
    }
    return dispatch(updateUser({ id: user.id, userData: user }));
  },
});

export default connect(null, mapDispatchToProps)(UserForm);
