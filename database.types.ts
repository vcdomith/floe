import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"
import { DocumentoImportado } from "@/hooks/useDocumento"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cadastros: {
        Row: {
          created_at: string
          documentos: { cte: DocumentoImportado, nfe: DocumentoImportado, pedido?: DocumentoImportado }
          fornecedor: string | null
          id: number
          produtos: ProdutoCadastro[]
        }
        Insert: {
          created_at?: string
          documentos?: { cte: DocumentoImportado, nfe: DocumentoImportado, pedido?: DocumentoImportado }
          fornecedor?: string | null
          id?: number
          produtos: ProdutoCadastro[]
        }
        Update: {
          created_at?: string
          documentos?: { cte: DocumentoImportado, nfe: DocumentoImportado, pedido?: DocumentoImportado }
          fornecedor?: string | null
          id?: number
          produtos?: ProdutoCadastro[]
        }
        Relationships: []
      }
      cadastros_normalized: {
        Row: {
          created_at: string
          fornecedor: string
          id: number
        }
        Insert: {
          created_at?: string
          fornecedor: string
          id?: number
        }
        Update: {
          created_at?: string
          fornecedor?: string
          id?: number
        }
        Relationships: []
      }
      ctes: {
        Row: {
          chCTe: string
          criado_em: string
          inserted_at: string
          nsu: string
          xml: string
        }
        Insert: {
          chCTe: string
          criado_em: string
          inserted_at?: string
          nsu: string
          xml: string
        }
        Update: {
          chCTe?: string
          criado_em?: string
          inserted_at?: string
          nsu?: string
          xml?: string
        }
        Relationships: []
      }
      fatores: {
        Row: {
          base: string | null
          created_at: string
          desconto: string | null
          fatorBaseNormal: string | null
          fatorBaseST: string | null
          id: number
          st: string | null
          transporte: string | null
        }
        Insert: {
          base?: string | null
          created_at?: string
          desconto?: string | null
          fatorBaseNormal?: string | null
          fatorBaseST?: string | null
          id?: number
          st?: string | null
          transporte?: string | null
        }
        Update: {
          base?: string | null
          created_at?: string
          desconto?: string | null
          fatorBaseNormal?: string | null
          fatorBaseST?: string | null
          id?: number
          st?: string | null
          transporte?: string | null
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          cnpj: string
          created_at: string
          fatorBase: string
          fatorBaseNormal: string
          fatorBaseST: string
          id: number
          nome: string
          nomeFantasia: string
          usaComposto: boolean
          usaDesconto: boolean
          usaIpi: boolean
          usaIpiProporcional: boolean
          usaSt: boolean
          usaTransporte: boolean
          usaUnitarioPedido: boolean
        }
        Insert: {
          cnpj?: string
          created_at?: string
          fatorBase: string
          fatorBaseNormal: string
          fatorBaseST: string
          id?: number
          nome: string
          nomeFantasia?: string
          usaComposto: boolean
          usaDesconto: boolean
          usaIpi: boolean
          usaIpiProporcional?: boolean
          usaSt: boolean
          usaTransporte: boolean
          usaUnitarioPedido: boolean
        }
        Update: {
          cnpj?: string
          created_at?: string
          fatorBase?: string
          fatorBaseNormal?: string
          fatorBaseST?: string
          id?: number
          nome?: string
          nomeFantasia?: string
          usaComposto?: boolean
          usaDesconto?: boolean
          usaIpi?: boolean
          usaIpiProporcional?: boolean
          usaSt?: boolean
          usaTransporte?: boolean
          usaUnitarioPedido?: boolean
        }
        Relationships: []
      }
      nfes: {
        Row: {
          chNFe: string | null
          criado_em: string | null
          inserted_at: string
          nsu: string
          xml: string | null
        }
        Insert: {
          chNFe?: string | null
          criado_em?: string | null
          inserted_at?: string
          nsu: string
          xml?: string | null
        }
        Update: {
          chNFe?: string | null
          criado_em?: string | null
          inserted_at?: string
          nsu?: string
          xml?: string | null
        }
        Relationships: []
      }
      produtos: {
        Row: {
          cadastro_id: number | null
          codigo: string | null
          composto: string[] | null
          fatores_id: number | null
          id: number
          st: boolean | null
          unitario: string | null
          unitarioNota: string | null
        }
        Insert: {
          cadastro_id?: number | null
          codigo?: string | null
          composto?: string[] | null
          fatores_id?: number | null
          id?: number
          st?: boolean | null
          unitario?: string | null
          unitarioNota?: string | null
        }
        Update: {
          cadastro_id?: number | null
          codigo?: string | null
          composto?: string[] | null
          fatores_id?: number | null
          id?: number
          st?: boolean | null
          unitario?: string | null
          unitarioNota?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_cadastro_id_fkey"
            columns: ["cadastro_id"]
            isOneToOne: false
            referencedRelation: "cadastros_normalized"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_fatores_id_fkey"
            columns: ["fatores_id"]
            isOneToOne: false
            referencedRelation: "fatores"
            referencedColumns: ["id"]
          },
        ]
      }
      ultNSU: {
        Row: {
          cte: string | null
          id: number
          nfe: string | null
          updated: string
        }
        Insert: {
          cte?: string | null
          id?: number
          nfe?: string | null
          updated?: string
        }
        Update: {
          cte?: string | null
          id?: number
          nfe?: string | null
          updated?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
