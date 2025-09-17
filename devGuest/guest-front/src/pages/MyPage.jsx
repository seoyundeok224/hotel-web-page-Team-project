import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Tabs,
    Tab,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    Person,
    Lock,
    Visibility,
    VisibilityOff,
    DeleteForever
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/hotelService';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const MyPage = () => {
    const { user, logout } = useAuth();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');

    // 프로필 수정 관련 상태
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [profileErrors, setProfileErrors] = useState({});

    // 비밀번호 변경 관련 상태
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // 회원탈퇴 관련 상태
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    // 컴포넌트 마운트 시 사용자 정보 로드
    useEffect(() => {
        loadUserProfile();
    }, []);

    // 사용자 프로필 로드
    const loadUserProfile = async () => {
        try {
            setLoading(true);

            // 디버깅 정보
            const token = localStorage.getItem('token');
            console.log('Current token:', token);
            console.log('Current user:', user);

            const response = await userService.getProfile();
            const userData = response.data;

            setProfileData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || ''
            });
        } catch (error) {
            console.error('프로필 로드 실패:', error);
            setMessage('프로필 정보를 불러오는데 실패했습니다.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // 탭 변경 핸들러
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setMessage('');
        setProfileErrors({});
        setPasswordErrors({});
    };

    // 프로필 데이터 변경 핸들러
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 메시지 클리어
        if (profileErrors[name]) {
            setProfileErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // 비밀번호 데이터 변경 핸들러
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        // 에러 메시지 클리어
        if (passwordErrors[name]) {
            setPasswordErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // 프로필 수정 제출
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = {};
        if (!profileData.name.trim()) {
            errors.name = '이름은 필수입니다.';
        }
        if (!profileData.email.trim()) {
            errors.email = '이메일은 필수입니다.';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            errors.email = '유효한 이메일 형식이어야 합니다.';
        }

        if (Object.keys(errors).length > 0) {
            setProfileErrors(errors);
            return;
        }

        try {
            setLoading(true);
            await userService.updateProfile(profileData);
            setMessage('프로필이 성공적으로 수정되었습니다.');
            setMessageType('success');
        } catch (error) {
            console.error('프로필 수정 실패:', error);
            setMessage(error.response?.data?.message || '프로필 수정에 실패했습니다.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 변경 제출
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        const errors = {};
        if (!passwordData.currentPassword) {
            errors.currentPassword = '현재 비밀번호는 필수입니다.';
        }
        if (!passwordData.newPassword) {
            errors.newPassword = '새 비밀번호는 필수입니다.';
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = '비밀번호는 6자 이상이어야 합니다.';
        }
        if (!passwordData.confirmPassword) {
            errors.confirmPassword = '비밀번호 확인은 필수입니다.';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.';
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        try {
            setLoading(true);
            await userService.changePassword(passwordData);
            setMessage('비밀번호가 성공적으로 변경되었습니다.');
            setMessageType('success');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            setMessage(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // 회원 탈퇴 처리
    const handleDeleteAccount = async () => {
        if (!deletePassword.trim()) {
            setDeleteError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            await userService.deleteAccount({ password: deletePassword });
            setDeleteDialog(false);
            setMessage('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
            setMessageType('success');

            // 잠시 후 로그아웃 처리
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            setDeleteError(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 탈퇴 취소 처리
    const handleCancelWithdrawal = async () => {
        try {
            setLoading(true);
            await userService.cancelAccountDeletion(user.username);
            setMessage('탈퇴가 성공적으로 취소되었습니다. 계정이 복구되었습니다.');
            setMessageType('success');
            
            // 페이지 새로고침하여 사용자 상태 업데이트
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('탈퇴 취소 실패:', error);
            setMessage(error.response?.data?.message || '탈퇴 취소에 실패했습니다.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 표시/숨기기 토글
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (loading && !profileData.name) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                마이페이지
            </Typography>

            {message && (
                <Alert severity={messageType} sx={{ mb: 3 }}>
                    {message}
                </Alert>
            )}

            <Paper sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="마이페이지 탭">
                        <Tab
                            icon={<Person />}
                            label="프로필 수정"
                            id="tab-0"
                            aria-controls="tabpanel-0"
                        />
                        <Tab
                            icon={<Lock />}
                            label="비밀번호 변경"
                            id="tab-1"
                            aria-controls="tabpanel-1"
                        />
                        <Tab
                            icon={<DeleteForever />}
                            label="회원 탈퇴"
                            id="tab-2"
                            aria-controls="tabpanel-2"
                        />
                    </Tabs>
                </Box>

                {/* 프로필 수정 탭 */}
                <TabPanel value={tabValue} index={0}>
                    <Box component="form" onSubmit={handleProfileSubmit}>
                        <Typography variant="h6" gutterBottom>
                            개인정보 수정
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="사용자명"
                                    value={user?.username || ''}
                                    disabled
                                    helperText="사용자명은 변경할 수 없습니다."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="이름"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.name}
                                    helperText={profileErrors.name}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="이메일"
                                    name="email"
                                    type="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.email}
                                    helperText={profileErrors.email}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="전화번호"
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    error={!!profileErrors.phone}
                                    helperText={profileErrors.phone}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} />}
                            >
                                프로필 수정
                            </Button>
                        </Box>
                    </Box>
                </TabPanel>

                {/* 비밀번호 변경 탭 */}
                <TabPanel value={tabValue} index={1}>
                    <Box component="form" onSubmit={handlePasswordSubmit}>
                        <Typography variant="h6" gutterBottom>
                            비밀번호 변경
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="현재 비밀번호"
                                    name="currentPassword"
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    error={!!passwordErrors.currentPassword}
                                    helperText={passwordErrors.currentPassword}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    edge="end"
                                                >
                                                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="새 비밀번호"
                                    name="newPassword"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    error={!!passwordErrors.newPassword}
                                    helperText={passwordErrors.newPassword}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('new')}
                                                    edge="end"
                                                >
                                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="새 비밀번호 확인"
                                    name="confirmPassword"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    error={!!passwordErrors.confirmPassword}
                                    helperText={passwordErrors.confirmPassword}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                    edge="end"
                                                >
                                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} />}
                            >
                                비밀번호 변경
                            </Button>
                        </Box>
                    </Box>
                </TabPanel>

                {/* 회원 탈퇴 탭 */}
                <TabPanel value={tabValue} index={2}>
                    <Typography variant="h6" gutterBottom color="error">
                        회원 탈퇴
                    </Typography>
                    
                    {/* 탈퇴 상태인 경우 탈퇴 취소 UI */}
                    {user?.enabled === false ? (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    계정이 탈퇴 처리되었습니다
                                </Typography>
                                <Typography variant="body2">
                                    • 현재 계정은 탈퇴 신청이 완료된 상태입니다<br/>
                                    • 탈퇴 신청 후 3일 이내에는 탈퇴를 취소할 수 있습니다<br/>
                                    • 3일 후에는 계정이 영구적으로 삭제됩니다
                                </Typography>
                            </Alert>
                            
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleCancelWithdrawal}
                                    disabled={loading}
                                    size="large"
                                >
                                    {loading ? '처리 중...' : '탈퇴 취소하기'}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        // 정상 상태인 경우 기존 탈퇴 UI
                        <Box>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                회원 탈퇴 시 모든 데이터가 삭제되며, 복구할 수 없습니다.
                                신중하게 결정해 주세요.
                            </Alert>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="body1" paragraph>
                                다음과 같은 정보가 삭제됩니다:
                            </Typography>
                            <ul>
                                <li>개인정보 (이름, 이메일, 전화번호 등)</li>
                                <li>예약 내역</li>
                                <li>서비스 이용 기록</li>
                            </ul>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setDeleteDialog(true)}
                                    startIcon={<DeleteForever />}
                                >
                                    회원 탈퇴하기
                                </Button>
                            </Box>
                        </Box>
                    )}
                </TabPanel>
            </Paper>

            {/* 회원 탈퇴 확인 다이얼로그 */}
            <Dialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle color="error">
                    회원 탈퇴 확인
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        정말로 회원 탈퇴를 진행하시겠습니까?
                    </DialogContentText>
                    
                    <Box sx={{ 
                        p: 2, 
                        backgroundColor: '#fff3e0', 
                        borderRadius: 1, 
                        border: '1px solid #ffb74d',
                        mb: 2 
                    }}>
                        <Typography variant="subtitle2" color="warning.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                            ⚠️ 중요 안내사항
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>즉시 계정 비활성화:</strong> 탈퇴 즉시 로그인이 불가능합니다.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            • <strong>3일 유예기간:</strong> 탈퇴 후 3일 동안 탈퇴 취소가 가능합니다.
                        </Typography>
                        <Typography variant="body2" color="error.main">
                            • <strong>완전 삭제:</strong> 3일 후 모든 개인정보가 영구적으로 삭제됩니다.
                        </Typography>
                    </Box>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        label="비밀번호 확인"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        error={!!deleteError}
                        helperText={deleteError}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setDeleteDialog(false);
                            setDeletePassword('');
                            setDeleteError('');
                        }}
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : '탈퇴하기'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyPage;