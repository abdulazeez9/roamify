"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  SimpleGrid,
  Link as ChakraLink,
  Separator,
  Icon,
  Input,
  IconButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import { Send } from "lucide-react";
import { navlinks } from "@/components/ui/navigation/navbar/nav.config";
import { Logo } from "@/components/ui/logo/Logo";
import { useState } from "react";
import { useSubscribeToNewsletter } from "@/hooks/api/use-newsletter";

const support = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Condition", href: "/terms-and-condition" },
  { label: "Safety Release Form", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { mutate: subscribe, isPending } = useSubscribeToNewsletter();

  const handleSubscribe = () => {
    if (!email) return;
    subscribe(email, {
      onSuccess: () => setEmail(""),
    });
  };

  return (
    <Box bg="primary" mt="auto" shadow="0 -10px 20px rgba(0,0,0,0.05)">
      <Container maxW="1440px" p={{ base: 6, md: 10 }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 6 }}
          gap={{ base: 8, md: 4 }}
        >
          {/* Brand Section */}
          <Stack>
            <Logo />
          </Stack>

          {/* Newsletter Section */}
          <Stack
            gridColumn={{ md: "span 2" }}
            order={{ base: 0, md: 5 }}
            zIndex={1}
          >
            <Text fontWeight="bold" color="textInverse">
              Explore the World With Us
            </Text>
            <Box position="relative">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                placeholder="Enter email..."
                size={{ base: "sm", md: "lg" }}
                w="full"
                pr="56px"
                borderRadius="20px"
                bg="dark"
                color="white"
                _focus={{
                  boxShadow: "none",
                  borderColor: "secondary",
                }}
              />
              <IconButton
                aria-label="Subscribe to newsletter"
                position="absolute"
                right="2px"
                top="50%"
                transform="translateY(-50%)"
                size="sm"
                borderRadius="50%"
                colorPalette="red"
                bg="secondary"
                cursor="pointer"
                onClick={handleSubscribe}
                loading={isPending}
              >
                <Icon as={Send} color="dark" />
              </IconButton>
            </Box>
          </Stack>

          {/* Pages Links */}
          <Stack>
            <Text fontWeight="bold" mb={2} color="textInverse">
              Pages
            </Text>
            {navlinks.map((link, index) => (
              <ChakraLink
                key={index}
                as={NextLink}
                href={link.href}
                textDecoration="none"
                color="textPrimary"
                _hover={{ color: "secondary", transition: "all 0.2s" }}
                fontSize="sm"
              >
                {link.label}
              </ChakraLink>
            ))}
          </Stack>

          {/* Support Links */}
          <Stack>
            <Text fontWeight="bold" mb={2} color="textInverse">
              Support
            </Text>
            {support.map((link, index) => (
              <ChakraLink
                key={index}
                as={NextLink}
                href={link.href}
                textDecoration="none"
                color="textPrimary"
                _hover={{ color: "secondary", transition: "all 0.2s" }}
                fontSize="sm"
              >
                {link.label}
              </ChakraLink>
            ))}
          </Stack>

          {/* Contact */}
          <Stack color="textPrimary">
            <Text fontWeight="bold" mb={2} color="textInverse">
              Contact Us
            </Text>
            <Text>muritador5050@gmail.com</Text>
            <Text>Phone: +234-8148-985-591</Text>
          </Stack>
        </SimpleGrid>

        <Separator my={8} borderColor="gray.200" opacity={0.2} />

        <Stack color="textPrimary" textAlign={{ md: "center" }} gap={1}>
          <Text>
            Safety as a System <sup>TM</sup>
          </Text>
          <Text>
            © {new Date().getFullYear()} Roamify. All rights reserved.
          </Text>
          <Text fontSize="xs" opacity={0.6}>
            Designed & built by Abdulazeez Muritador
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
