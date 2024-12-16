import React, { useEffect, useState } from 'react';
import { fetchAllRoles } from '../../services/roles/GET/roles.get.service';
import { IRoles } from '../../services/roles/models/roles.interface';
import { Navigate } from 'react-router-dom';
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roles, setRoles] = useState<IRoles[]>([]);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRolesAndUser = async () => {
            try {
                const rolesData = await fetchAllRoles();
                setRoles(rolesData);

                const userData = await fetchUserDetail();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        getRolesAndUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const adminRole = roles.find(role => role.name === 'ADMIN');

    if (!user || !adminRole || user.role._id !== adminRole._id) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;