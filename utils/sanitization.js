export const sanitizeUser = function (user) {
    return {
        _id: user._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        active: user?.active,
        users: user.users,
        adminUser: user?.adminUser,
        passwordResetCodeVerify: user?.passwordResetCodeVerify,
        createdAt: user?.createdAt,
    };
};