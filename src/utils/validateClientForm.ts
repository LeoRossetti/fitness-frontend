export const validateClientForm = (data: { name: string; email: string }) => {
    const errors: { name?: string; email?: string } = {};
  
    if (!data.name.trim()) {
      errors.name = 'Name is required';
    }
  
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }
  
    return errors;
  };