import * as assert from "assert";
import { AsnParser, AsnConvert } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import { Certificate, id_ce_cRLDistributionPoints, CRLDistributionPoints, id_ce_keyUsage, KeyUsage, id_ce_extKeyUsage, ExtendedKeyUsage, NameConstraints, GeneralSubtrees, GeneralSubtree, GeneralName } from "../src";
import { CertificateTemplate } from "@peculiar/asn1-x509-microsoft";

context("x509", () => {

  it("cert #1", () => {
    const pem = "MIIDljCCAn6gAwIBAgIOSETcxtRwD/qzf0FjVvEwDQYJKoZIhvcNAQELBQAwZjELMAkGA1UEBhMCQkUxGTAXBgNVBAoTEEdsb2JhbFNpZ24gbnYtc2ExGjAYBgNVBAsTEUZvciBEZW1vIFVzZSBPbmx5MSAwHgYDVQQDExdHbG9iYWxTaWduIERlbW8gUm9vdCBDQTAeFw0xNjA3MjAwMDAwMDBaFw0zNjA3MjAwMDAwMDBaMGYxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEgMB4GA1UEAxMXR2xvYmFsU2lnbiBEZW1vIFJvb3QgQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC1i9RNgrJ4YAATN0J4KVGZjFGQVGFdcbKvfxrt0Bfusq2g81iVrZZjqTJnPSx4g6TdVcsEXU9GWlkFXKEtZzYM4ycbwLAeJQxQDEqkV03GV8ks2Jq/6jIm2DbByPiS5fvRQFQJLYuQHqXpjpOpmPiostUsg9ydMEqcacYV22a6A6Nrb1c1B6OL+X0u9bo30K+YYSw2Ngp3Tuuj9PDk6JS/0CPLcLo8JIFFc8t78lPDquNAOqTDwY/HTw4751iqLVem9q3EDKEeUS+x4gqsCD2pENA7PlQBza55BGOi/A+UAsmfee1oq2Glo9buXBgX+oJ3HnyelzJU9Ej4+yfH7rcvAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTqD8ID9OxgG83HZJVtOQMmftrrLzANBgkqhkiG9w0BAQsFAAOCAQEAAECKKpL0A2I+hsY881tIz7WqkLDuLh/ISzRVdsALYAxLhVDUHPckh5XyVRkpbTmirn+b5MpuwAI2R8A7Ld6aWWiibc7zGEZNvEKsUEYoJoYR0fuQs2cF7egiYjhFwFMX75w+kuI0Yelm3/3+BiJVtAXqmnQ4yRpGXqNJ4mQC8yWgQbZCLUpH/nqeQANeoaDr5Yg8IOuHRQzG6YNt/Cl9CetDd8WPrAkGm3T2iG0dXQ48VgkkXcNDtY+55nYjIO+N7i+WTh1fe3ArGxHBR3E44+WoA8ntfI1g65+GR0s6G8M7oS+kAFXIwugUGYEnTWp0m5bAn5NlD314IEOg4mnS8Q==";
    const cert = AsnParser.parse(Convert.FromBase64(pem), Certificate);
    assert.equal(!!cert, true);
  });

  it("cert #2", () => {
    const pem = "MIIFjjCCBHagAwIBAgIMVcQBzZcO9v+nopB+MA0GCSqGSIb3DQEBCwUAMGkxCzAJBgNVBAYTAkJFMRkwFwYDVQQKExBHbG9iYWxTaWduIG52LXNhMRowGAYDVQQLExFGb3IgRGVtbyBVc2UgT25seTEjMCEGA1UEAxMaR2xvYmFsU2lnbiBEZW1vIElzc3VpbmcgQ0EwHhcNMjAwNDEyMDgyNTUzWhcNMjEwNDEzMDgyNTUzWjCBrTELMAkGA1UEBhMCVVMxFjAUBgNVBAgTDU5ldyBIYW1wc2hpcmUxEzARBgNVBAcTClBvcnRzbW91dGgxHTAbBgNVBAoTFEdNTyBHbG9iYWxTaWduLCBJbmMuMRcwFQYDVQQLEw5UZXN0IFByb2ZpbGUgMjERMA8GA1UEAxMIYWVnYWRtaW4xJjAkBgkqhkiG9w0BCQEWF2FlZ2FkbWluQGFlZ2RvbWFpbjIuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp6rQnYSkVFPQpAwyW74bCzITeb0cUqwlTOb+oWbySich01wjkCxSozRfddrE9pLrN+HAMp2IJpsSrg5tn7TVaJOhbJ1nW0kfRlBZ+3EvUcuUrsuHI2ntfFJu/JURkxSJa1A0eff7XoFQayXk4HL8Jx4d/7Vn0ky5BrFB7KW/7YHrxs5cFA5ESNcuESn9/aJvIfzDSZD6vqZM9avMAjT4Na78Wz5YPBzVClu/+HeaDL7iavbLieDwZNoSX+YpgCtmPcWCBGN1oDvv+LBL0ajZfVrhYcVPdfgo0APdHy0P06D9nIP+ajdtevOlyTcEdTDi0EhE2HZZ3cCsOoxXO7mQAQIDAQABo4IB7zCCAeswDgYDVR0PAQH/BAQDAgWgMH8GCCsGAQUFBwEBBHMwcTA5BggrBgEFBQcwAoYtaHR0cDovL3NlY3VyZS5nbG9iYWxzaWduLmNvbS9nc2RlbW9zaGEyZzMuY3J0MDQGCCsGAQUFBzABhihodHRwOi8vb2NzcDIuZ2xvYmFsc2lnbi5jb20vZ3NkZW1vc2hhMmczMD4GCSsGAQQBgjcVBwQxMC8GJysGAQQBgjcVCIKctRyHkpQFhcmDFIK1r3mEl94zgQaGrIEigpjgDQIBZAIBCDBNBgNVHSAERjBEMEIGCisGAQQBoDIBKAowNDAyBggrBgEFBQcCARYmaHR0cHM6Ly93d3cuZ2xvYmFsc2lnbi5jb20vcmVwb3NpdG9yeS8wCQYDVR0TBAIwADA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLmdsb2JhbHNpZ24uY29tL2dzZGVtb3NoYTJnMy5jcmwwIgYDVR0RBBswGYEXYWVnYWRtaW5AYWVnZG9tYWluMi5jb20wHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMB8GA1UdIwQYMBaAFHWgf0jK74nlOaHa0qZD5p8+v0gEMB0GA1UdDgQWBBRNAPBJcnbCXITXO7RHXQVOtdH0djANBgkqhkiG9w0BAQsFAAOCAQEAqzlvDaNnrL+dnSB12hS6/ZHF9TTb1BegiOxv1b0d0zHfufiFWrBCAvZ0P9E1+jjLfiIJc23xsbaVyUmVobEPgCHV5lIC7u+9QTGF0R4hWFh0q6ZnytYoOa3KPkO+rQ5xhWMeZ7kETRePrf7fm89cysKEtvYgH7lSdWnyAujJukkoMB9NOxVbWmjdN2wymrtNWypgaC2TtM4DnBttR7Ke0SdMKN/apmsDlJ0Z8J+8B+sMbSVhOjLneXghpOy5uYIMT1FOvKoN8xn1Mp4h19FkTkNGDGCGWMsnQelfzaaOBaiBXSy/vc/qNt+ZHCiLvXBWEiC6qLVM2dKZ/Ab8Xv+/3Q==";
    const cert = AsnParser.parse(Convert.FromBase64(pem), Certificate);
    cert.tbsCertificate.extensions?.forEach((extension) => {
      if (extension.extnID === id_ce_cRLDistributionPoints) {
        const crlDistributionPoints = AsnParser.parse(extension.extnValue, CRLDistributionPoints);
        assert.equal(
          crlDistributionPoints[0].distributionPoint?.fullName?.[0].uniformResourceIdentifier,
          "http://crl.globalsign.com/gsdemosha2g3.crl");
      }
      if (extension.extnID === id_ce_keyUsage) {
        const keyUsage = AsnParser.parse(extension.extnValue, KeyUsage);
        assert.equal(keyUsage.toString(), "[digitalSignature, keyEncipherment]");
      }
    });
    assert.equal(!!cert, true);
  });

  it("Extended key usages", () => {
    const hex = `300c06042a030405060453040506`;
    const eku = AsnParser.parse(Convert.FromHex(hex), ExtendedKeyUsage);
    assert.equal(eku.join(", "), "1.2.3.4.5, 2.3.4.5.6");
  });

  it("Name constrains", () => {
    var nameConstrains = new NameConstraints({
      permittedSubtrees: new GeneralSubtrees([
        new GeneralSubtree({
          base: new GeneralName({
            dNSName: "some.dns.com",
          })
        }),
        new GeneralSubtree({
          base: new GeneralName({
            iPAddress: "192.168.1.1",
          })
        }),
        new GeneralSubtree({
          base: new GeneralName({
            iPAddress: "2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d",
          })
        }),
      ])
    });

    const der = AsnConvert.serialize(nameConstrains);

    const test = AsnParser.parse(der, NameConstraints);

    assert.equal(test.permittedSubtrees![0].base.dNSName, "some.dns.com");
    assert.equal(test.permittedSubtrees![1].base.iPAddress, "192.168.1.1");
    assert.equal(test.permittedSubtrees![2].base.iPAddress, "2001:db8:11a3:9d7:1f34:8a2e:7a0:765d");
  });

  it("Certificate template", () => {
    const certTemplate = new CertificateTemplate({
      templateID: "1.2.3.4.5.6.7.8.9",
      templateMajorVersion: 101,
      templateMinorVersion: 0,
    });

    const der = AsnConvert.serialize(certTemplate);

    const test = AsnConvert.parse(der, CertificateTemplate);
    assert.equal(test.templateID, "1.2.3.4.5.6.7.8.9");
    assert.equal(test.templateMajorVersion, 101);
    assert.equal(test.templateMinorVersion, 0);
  });

});
