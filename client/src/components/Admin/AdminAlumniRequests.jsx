import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch pending requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/admin/pendingRequests');
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    setRequests([]); // Default to an empty array if the format is unexpected
                }
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // Approve a request
    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/approveReject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action: 'approve' }),
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setRequests(requests.filter((req) => req.id !== id));
            } else {
                alert('Error approving request: ' + result.error);
            }
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    // Reject a request
    const handleReject = async (id) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(`http://localhost:3000/api/admin/approveReject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, action: 'reject', reason }),
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                setRequests(requests.filter((req) => req.id !== id));
            } else {
                alert('Error rejecting request: ' + result.error);
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Welcome to the Admin Dashboard</h1>
            <p>You are logged in as an administrator.</p>

            <h2>Pending Alumni Requests</h2>

            {loading ? (
                <p>Loading requests...</p>
            ) : requests.length === 0 ? (
                <p>No pending requests.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '16px',
                                textAlign: 'left',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            <img
                                src={request.documentPath}
                                alt="Document"
                                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }}
                            />
                            <p><strong>Name:</strong> {request.name}</p>
                            <p><strong>Username:</strong> {request.username}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>Graduation Year:</strong> {request.graduationYear}</p>

                            <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleApprove(request.id)}
                                    style={{
                                        padding: '8px 16px',
                                        marginRight: '10px',
                                        backgroundColor: 'green',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(request.id)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;