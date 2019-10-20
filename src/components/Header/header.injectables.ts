import { graphql, useStaticQuery } from "gatsby";
import {
  LogoImageQuery,
  LogoImageQuery_file_childImageSharp_fixed,
} from "../../graphql/gatsby-types/LogoImageQuery";

export function useLogo() {
  const { file } = useStaticQuery<LogoImageQuery>(
    graphql`
      query LogoImageQuery {
        file(relativePath: { eq: "logo.png" }) {
          childImageSharp {
            fixed(width: 28, height: 28) {
              src
              width
              height
            }
          }
        }
      }
    `,
  );

  return (file &&
    file.childImageSharp &&
    file.childImageSharp.fixed) as LogoImageQuery_file_childImageSharp_fixed;
}
