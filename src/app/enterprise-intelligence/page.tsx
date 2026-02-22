'use client';

import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    Link as MuiLink,
    Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

// Image URLs from local public folder
const imgHeroImage = '/apps/enterprise-intelligence/Hero%20Image.png';
const imgEye = '/apps/enterprise-intelligence/Eye.svg';
const imgMediumRisk = '/apps/enterprise-intelligence/MediumRisk.svg';
const imgGoal = '/apps/enterprise-intelligence/Goal.svg';
const WhatYouGet = '/apps/enterprise-intelligence/WhatYouGet.svg';
const imgAiFile = '/apps/enterprise-intelligence/AI%20File.svg';
const imgTracking = '/apps/enterprise-intelligence/Tracking.svg';
const TheProblemIg = '/apps/enterprise-intelligence/TheProblemImg.svg';

// Styled Components
const HeaderSection = styled(Box)({
    background: 'white',
    padding: '0px 20px',
    margin: '0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});
36
const HeroSection = styled(Box)({
    background: 'white',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
});

const PrimaryButton = styled(Button)({
    backgroundColor: '#ff5e00',
    color: 'white',
    borderRadius: '30px',
    padding: '12px 24px',
    fontSize: '18px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#e85200',
    },
});

const OutlineButton = styled(Button)({
    border: '2px solid #e3572b',
    color: '#e3572b',
    borderRadius: '30px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
        backgroundColor: 'rgba(227, 87, 43, 0.05)',
    },
});

const SectionTitle = styled(Typography)({
    fontSize: '64px',
    fontWeight: 600,
    color: 'black',
    marginBottom: '30px',
    textAlign: 'center',
});

const SectionSubtitle = styled(Typography)({
    fontSize: '24px',
    color: '#5a5a59',
    lineHeight: '1.5',
    marginBottom: '20px',
});

const ContactForm = styled('form')({
    backgroundColor: '#008755',
    borderRadius: '10px',
    padding: '40px',
    color: 'white',
    display: 'block',
});

const FormField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: '14px',
        '& fieldset': {
            borderColor: '#f5f5f5',
        },
    },
    '& .MuiOutlinedInput-input': {
        color: 'black',
        '&::placeholder': {
            color: '#999',
            opacity: 0.6,
        },
    },
    '& .MuiInputBase-input': {
        fontSize: '16px',
    },
});

const FooterSection = styled(Box)({
    backgroundColor: 'white',
    borderTop: '1px solid #e3572b',
    padding: '60px 40px',
});

const FeatureCard = styled(Card)({
    backgroundColor: '#e3572b',
    borderRadius: '10px',
    padding: '0px 25px',
    textAlign: 'center',
    minHeight: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

interface FormData {
    fullName: string;
    email: string;
    subject: string;
    message: string;
}

export default function EnterpriseIntelligenceSuite() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const whatYouGetItems = [
        {
            icon: imgTracking,
            text: 'Real-time market demand signals by region and category',
            height: 47,
        },
        {
            icon: imgAiFile,
            text: 'AI-recommended crops by demand, price, and profitability',
            height: 47,
        },
        {
            icon: imgEye,
            text: 'Price trends & volatility tracking',
            height: 47,
        },
        {
            icon: imgGoal,
            text: 'Demand vs supply visibility (as farms connect)',
            height: 47,
        },
        {
            icon: imgMediumRisk,
            text: 'Predictive supply risk indicators (as farms connect)',
            height: 58,
        },
    ];

    const whoShouldSignUpItems = [
        'Food retailers & distributors',
        'Processors & sourcing teams ',
        'Suitability & Compliance team',
        'Farm Intelligence-Automation Suite',
    ];
    const socialMediaLinks = [
        {
            href: 'https://www.linkedin.com/company/innofarms-ai/posts/?feedView=all',
            Icon: LinkedInIcon,
            alt: 'LinkedIn',
        },
        {
            href: 'https://www.instagram.com/innofarmsai?igsh=YWVhNTVzNm1uMzJ1&utm_source=qr',
            Icon: InstagramIcon,
            alt: 'Instagram',
        },
        {
            href: 'https://www.facebook.com/profile.php?id=61572499063318',
            Icon: FacebookIcon,
            alt: 'Facebook',
        },
        {
            href: 'https://x.com/innofarmsai?s=21x.com',
            Icon: TwitterIcon,
            alt: 'Twitter',
        },
    ];
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
        setTimeout(() => {
            setFormData({ fullName: '', email: '', subject: '', message: '' });
            setFormSubmitted(false);
        }, 2000);
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <HeaderSection sx={{
                flexDirection: { xs: 'column', md: 'row' },
                padding: { xs: '10px', md: '35px 20px' },
                gap: { xs: '20px', sm: '20px', md: '8px', lg: '0px'},
            }}>
                <Box sx={{ flex: { md: 1 }, display: { xs: 'none', md: 'block' } }} />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: { xs: '200px', sm: '280px', md: '400px' },
                    '& svg, & img': {
                        fill: '#008755 !important',
                        color: '#008755 !important',
                        filter: 'brightness(0) saturate(100%) invert(33%) sepia(52%) saturate(1482%) hue-rotate(123deg) brightness(91%) contrast(101%)',
                    }
                }}>
                    <Image
                        src="/apps/LogoWhiteHorizontal.svg"
                        alt="INNOFarms Logo"
                        width={400}
                        height={150}
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                    />
                </Box>
                <Box sx={{
                    flex: { md: 1 },
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    gap: { xs: '6px', sm: '8px', md: '10px' },
                    alignItems: 'center',
                    flexDirection: { xs: 'row', sm: 'row' },
                }}>
                    <MuiLink
                        href="https://wa.me/971542195288?text=Hi%20Braj%2C%20we%20met%20at%20Gulfood.%20Interested%20in%20learning%20more%20about%20INNOFarms.AI%20AI%20SaaS%20intelligence%20Platform"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                    >
                        <OutlineButton sx={{ fontSize: { xs: '10px', sm: '11px', md: '14px' }, padding: { xs: '4px 8px', sm: '5px 10px', md: '8px 16px' } }}>
                            Contact us
                        </OutlineButton>
                    </MuiLink>
                    <MuiLink
                        href="https://calendly.com/brajendra-yadav-innofarms/30min?month=2026-01"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="none"
                    >
                        <OutlineButton sx={{ fontSize: { xs: '10px', sm: '11px', md: '14px' }, padding: { xs: '4px 8px', sm: '5px 10px', md: '8px 16px' } }}>
                            Book a Demo
                        </OutlineButton>
                    </MuiLink>
                </Box>
            </HeaderSection>

            {/* Title Section - Above Image */}
            <Box sx={{ background: 'white', padding: '0px 20px' }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography sx={{
                        width: '100%',
                        textAlign: 'center',
                        background: 'linear-gradient(90deg, #008755 0%, #000000 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundCl9ip: 'text',
                        fontSize: { xs: 32, sm: 42, md: 60 },
                        fontFamily: 'Outfit',
                        fontWeight: '700',
                        wordWrap: 'break-word',
                        lineHeight: { xs: 1.1, sm: 1.15, md: 1.2 },
                        marginBottom: { xs: '8px', sm: '16px', md: '10px', lg: '10px' },
                        marginTop: { xs: '16px', sm: '16px', md: '10px', lg: '0px' }
                    }}>
                        Enterprise Intelligence Suite
                    </Typography>
                    <Typography style={{ textAlign: 'center', color: '#5A5A59', fontSize: 16, fontFamily: 'Poppins', fontWeight: '600', lineHeight: 1.6, letterSpacing: 0.15, wordWrap: 'break-word', marginBottom: '10px' }}>
                        Get real-time market demand signals today. Activate full supply intelligence as farms connect.
                    </Typography>
                </Container>
            </Box>

            {/* Hero Section */}
            <HeroSection sx={{
                backgroundImage: `url(${imgHeroImage})`,
                minHeight: 'auto',
                height: { xs: '250px', sm: '350px', md: '450px', lg: '600px' },
                backgroundSize: 'contain',
            }}>
            </HeroSection>

            {/* Content Below Image */}
            <Box sx={{ background: 'white', padding: { xs: '20px', sm: '30px', md: '40px' } }}>
                <Box sx={{ width: '100%', textAlign: 'center', marginBottom: { xs: '20px', sm: '30px', md: '40px' } }}>
                    <Typography component="span" sx={{ color: '#5A5A59', fontSize: { xs: 16, sm: 22, md: 28 }, fontFamily: 'Outfit', fontWeight: '700', wordWrap: 'break-word' }}>
                        Enterprise Intelligence Suite{' '}
                    </Typography>
                    <Typography component="span" sx={{ color: '#5A5A59', fontSize: { xs: 16, sm: 22, md: 28 }, fontFamily: 'Outfit', fontWeight: '400', wordWrap: 'break-word' }}>
                        - Enterprise Supply & Market Intelligence for AgriFood Networks.
                    </Typography>
                    <Box sx={{ display: { xs: 'block', sm: 'block', md: 'block' }, height: { xs: '8px', sm: '12px', md: '16px' } }} />
                    <Typography component="span" sx={{ color: '#02542D', fontSize: { xs: 14, sm: 20, md: 26 }, fontFamily: 'Outfit', fontWeight: '700', wordWrap: 'break-word' }}>
                        Know What the Market Wants {' '} Know If Your Supply Can Deliver.
                    </Typography>
                </Box>

                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Box sx={{ color: 'black', fontSize: { xs: 14, sm: 18, md: 28 }, fontFamily: 'Outfit', fontWeight: '400', wordWrap: 'break-word', padding: { xs: '0px', sm: '0px', md: '0px' }, lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 } }}>
                        INNOFarms.AI helps food enterprises and farms move from reactive decisions to predictive intelligence — without heavy integration.
                    </Box>
                </Container>

                <Container maxWidth="md" sx={{ textAlign: 'center', marginTop: '40px' }}>
                    <PrimaryButton 
                        onClick={() => router.push('/enterprise')}
                        sx={{ padding: '13px 26px', fontSize: '18px', borderRadius: 0 }}
                    >
                        Click to Get Access
                    </PrimaryButton>

                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 3 }} justifyContent="center" sx={{ marginBottom: { xs: '20px', sm: '30px', md: '40px' }, marginTop: { xs: '15px', sm: '18px', md: '20px' }, flexWrap: 'wrap', gap: { xs: '12px', sm: '16px', md: '24px' } }}>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 0.75, md: 1 }}>
                            <Box sx={{ width: { xs: '10px', sm: '12px', md: '16px' }, height: { xs: '10px', sm: '12px', md: '16px' }, borderRadius: '50%', backgroundColor: '#FF5E00' }} />
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>Free</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 0.75, md: 1 }}>
                            <Box sx={{ width: { xs: '10px', sm: '12px', md: '16px' }, height: { xs: '10px', sm: '12px', md: '16px' }, borderRadius: '50%', backgroundColor: '#FF5E00' }} />
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>No hardware</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 0.75, md: 1 }}>
                            <Box sx={{ width: { xs: '10px', sm: '12px', md: '16px' }, height: { xs: '10px', sm: '12px', md: '16px' }, borderRadius: '50%', backgroundColor: '#FF5E00' }} />
                            <Typography sx={{ color: '#333', fontWeight: 600, fontSize: { xs: '12px', sm: '13px', md: '14px' } }}>1-minute sign-up</Typography>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* The Problem Section */}
            <Container maxWidth="lg" sx={{ padding: { xs: '20px 15px', sm: '30px 20px', md: '0px 20px' } }}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                                height: { xs: '200px', sm: '250px', md: '300px' },
                                position: 'relative',
                            }}
                        >
                            <Image
                                src={TheProblemIg}
                                alt="The Problem"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <SectionTitle sx={{ textAlign: 'left', marginBottom: { xs: '8px', sm: '10px', md: '10px' }, fontSize: { xs: '28px', sm: '40px', md: '52px' }, fontWeight: 400 }}>
                            The Problem
                        </SectionTitle>
                        <Box sx={{ marginBottom: { xs: '15px', sm: '20px', md: '20px' } }}>
                            <Typography sx={{ fontSize: { xs: '16px', sm: '18px', md: '24px' }, fontWeight: 400 }}>
                                Food decisions break for two reasons:
                            </Typography>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', margin: '12px 0px' }}>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginBottom: '4px', opacity: 0.9 }}>
                                        Market demand changes faster than farms can respond
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginBottom: '4px', opacity: 0.9 }}>
                                        Supply risks are discovered too late — after losses occur
                                    </Typography>
                                </li>
                                <li>
                                    <Typography sx={{ fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginBottom: '4px', opacity: 0.936 }}>
                                        No evidence grade Traceability & ESG
                                    </Typography>
                                </li>
                            </ul>
                            <Typography
                                sx={{
                                    fontSize: { xs: '14px', sm: '16px', md: '18px' },
                                    fontWeight: 700,
                                    marginTop: { xs: '12px', sm: '16px', md: '20px' },
                                    color: 'black',
                                }}
                            >
                                Spreadsheets don't predict. Reports don't prevent risk.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* What You Get Instantly Section */}
            <Container maxWidth="lg" sx={{ padding: { xs: '30px 15px', sm: '50px 20px', md: '80px 20px' } }}>
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ order: { xs: 2, sm: 2, md: 1 } }}>
                        <SectionTitle sx={{ textAlign: 'left', marginBottom: { xs: '8px', sm: '10px', md: '8px' }, fontSize: { xs: '28px', sm: '38px', md: '48px' }, fontFamily: 'Outfit', fontWeight: 600 }}>
                            What You Get Instantly
                        </SectionTitle>
                        <Box sx={{ marginBottom: { xs: '15px', sm: '18px', md: '20px' } }}>
                            <Box sx={{ marginBottom: { xs: '12px', sm: '15px', md: '18px' } }}>
                                <Typography component="span" sx={{ color: 'black', fontSize: { xs: '14px', sm: '17px', md: 20 }, fontFamily: 'Outfit', fontWeight: '400', lineHeight: 1.5 }}>
                                    Enterprise Supply & Market Intelligence — Live
                                </Typography>
                                <Box sx={{ display: 'block', height: { xs: '6px', sm: '8px', md: '10px' } }} />
                                <Typography component="span" sx={{ color: '#008755', fontSize: { xs: '16px', sm: '20px', md: 24 }, fontFamily: 'Outfit', fontWeight: '400', lineHeight: 1.625 }}>
                                    With INNOFarms.AI, you instantly access:
                                </Typography>
                            </Box>
                            <Stack spacing={{ xs: 0.75, sm: 0.875, md: 1 }}>
                                {whatYouGetItems.map(({ icon, text, height }, idx) => (
                                    <Stack key={idx} direction="row" spacing={{ xs: 0.75, sm: 0.875, md: 1 }} alignItems="flex-start">
                                        <Box
                                            sx={{
                                                width: { xs: '30px', sm: '40px', md: '50px' },
                                                height: { xs: height * 0.64, sm: height * 0.85, md: height },
                                                position: 'relative',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Image src={icon} alt={text} fill style={{ objectFit: 'contain' }} />
                                        </Box>
                                        <Typography sx={{ fontSize: { xs: '12px', sm: '14px', md: '18px' }, paddingTop: { xs: '4px', sm: '6px', md: '10px' } }}>
                                            {text}
                                        </Typography>
                                    </Stack>
                                ))}
                            </Stack>
                            <Typography
                                sx={{
                                    fontSize: { xs: '12px', sm: '14px', md: '18px' },
                                    fontWeight: 700,
                                    marginTop: { xs: '12px', sm: '15px', md: '18px' },
                                    color: '#008755',
                                    textDecoration: 'underline',
                                }}
                            >
                                No integrations. No sensors required. No disruption. <br />Live pilots with enterprise customers in the GCC.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ order: { xs: 1, sm: 1, md: 2 } }}>
                        <Box
                            sx={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '4 / 3',
                                backgroundColor: 'white',
                            }}
                        >
                            <Image
                                src={WhatYouGet}
                                alt="What You Get"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Who Should Sign Up Section */}
            <Container maxWidth="lg" sx={{ padding: { xs: '20px 15px', sm: '40px 20px', md: '0px 20px' } }}>
                <Box sx={{ textAlign: 'center', marginBottom: { xs: '30px', sm: '40px', md: '50px' } }}>
                    <SectionTitle
                        sx={{
                            color: 'black',
                            fontSize: { xs: '28px', sm: '40px', md: '52px', lg: '64px' },
                            fontFamily: 'Outfit',
                            fontWeight: 400,
                            wordWrap: 'break-word',
                            marginBottom: '0px',
                        }}
                    >
                        Who should sign up
                    </SectionTitle>
                    <Typography sx={{ fontSize: { xs: '16px', sm: '20px', md: '24px' }, marginBottom: { xs: '12px', sm: '14px', md: '16px' }, fontFamily: 'Outfit', fontWeight: 400 }}>
                        <strong>No credit card.</strong> <strong>No hardware</strong>. <strong>No commitment.</strong>
                    </Typography>
                </Box>
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                    {whoShouldSignUpItems.map((label) => (
                        <Grid item xs={12} sm={6} md={3} key={label}>
                            <FeatureCard>
                                <Typography sx={{ color: 'white', fontSize: { xs: '14px', sm: '16px', md: '20px' }, fontWeight: 600, textAlign: 'center', lineHeight: '1' }}>
                                    {label}
                                </Typography>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: { xs: '16px', sm: '20px', md: '40px' },
                                margin: { xs: '40px 0px', sm: '50px 0px', md: '70px 0px' },
                            }}
                        >
                            <MuiLink
                                href="https://calendly.com/brajendra-yadav-innofarms/30min?month=2026-01"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#008756',
                                        fontSize: { xs: '16px', sm: '20px', md: '20px' },
                                        fontFamily: 'Poppins',
                                        fontWeight: 600,
                                        textDecoration: 'underline',
                                        lineHeight: '1.5',
                                        wordWrap: 'break-word',
                                        textAlign: { xs: 'center', md: 'left' },
                                    }}
                                >
                                    Book a 30-min Pilot Activation | Meet Us at GulFood
                                </Typography>
                            </MuiLink>
                            <MuiLink
                                href="https://wa.me/971542195288?text=Hi%20Braj%2C%20we%20met%20at%20Gulfood.%20Interested%20in%20learning%20more%20about%20INNOFarms.AI%20AI%20SaaS%20intelligence%20Platform"
                                target="_blank"
                                rel="noopener noreferrer"
                                underline="none"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: '#008756',
                                        fontSize: { xs: '16px', sm: '20px', md: '20px' },
                                        fontFamily: 'Poppins',
                                        fontWeight: 600,
                                        textDecoration: 'underline',
                                        lineHeight: '1.5',
                                        wordWrap: 'break-word',
                                        textAlign: { xs: 'center', md: 'left' },
                                    }}
                                >
                                    Need Support? WhatsApp us
                                </Typography>
                            </MuiLink>
                        </Box>
                        <Typography
                            sx={{
                                color: 'black',
                                fontSize: { xs: '20px', sm: '26px', md: '36px' },
                                fontFamily: 'Outfit',
                                fontWeight: 400,
                                wordWrap: 'break-word',
                                marginBottom: { xs: '25px', sm: '32px', md: '40px' },
                                lineHeight: { xs: 1.3, sm: 1.3, md: 1.2 },
                                marginTop: { xs: '20px', sm: '25px', md: '50px' },
                                paddingTop: { xs: '0px', sm: '0px', md: '60px' }
                            }}
                            textAlign="center"
                        >
                            Global Enterprise-First AI SaaS Intelligence Platform for Global Food Systems.
                        </Typography>
            </Container>

            {/* Footer */}
            <Box
                sx={{
                    width: '100%',
                    background: '#008755',
                    padding: { xs: '15px 10px', sm: '18px 15px', md: '20px 20px' },
                    marginTop: '20px',
                }}
            >
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2 }} alignItems="center" justifyContent="center" flexWrap="wrap">
                        <Typography
                            sx={{
                                color: 'white',
                                fontSize: { xs: 14, sm: 16, md: 20 },
                                fontFamily: 'Open Sans',
                                fontWeight: 700,
                                wordWrap: 'break-word',
                            }}
                        >
                            Follow us on:
                        </Typography>
                        {socialMediaLinks.map(({ href, Icon, alt }) => (
                            <MuiLink
                                key={alt}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                            >
                                <Icon sx={{ color: 'white', fontSize: { xs: 20, sm: 24, md: 32 }, fill: 'white' }} />
                            </MuiLink>
                        ))}
                    </Stack>
                </Container>
            </Box>

        </Box>
    );
}
