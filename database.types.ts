// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

import { ProdutoCadastro } from "@/app/(app)/calcular/context/CalcularContext"
import { IProduto } from "@/interfaces/IProduto"

export type Json = ProdutoCadastro[]

export type Database = {
  public: {
    Tables: {
      cadastros: {
        Row: {
          created_at: string
          fornecedor: string | null
          id: number
          produtos: Json
        }
        Insert: {
          created_at?: string
          fornecedor?: string | null
          id?: number
          produtos?: Json | null
        }
        Update: {
          created_at?: string
          fornecedor?: string | null
          id?: number
          produtos?: Json | null
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
          created_at: string
          fatorBase: string | null
          fatorBaseNormal: string | null
          fatorBaseST: string | null
          id: number
          nome: string
          usaComposto: boolean | null
          usaDesconto: boolean | null
          usaIpi: boolean | null
          usaIpiUniversal: boolean
          usaSt: boolean | null
          usaTransporte: boolean | null
          usaUnitarioPedido: boolean | null
        }
        Insert: {
          created_at?: string
          fatorBase?: string | null
          fatorBaseNormal?: string | null
          fatorBaseST?: string | null
          id?: number
          nome?: string
          usaComposto?: boolean | null
          usaDesconto?: boolean | null
          usaIpi?: boolean | null
          usaIpiUniversal?: boolean
          usaSt?: boolean | null
          usaTransporte?: boolean | null
          usaUnitarioPedido?: boolean | null
        }
        Update: {
          created_at?: string
          fatorBase?: string | null
          fatorBaseNormal?: string | null
          fatorBaseST?: string | null
          id?: number
          nome?: string
          usaComposto?: boolean | null
          usaDesconto?: boolean | null
          usaIpi?: boolean | null
          usaIpiUniversal?: boolean
          usaSt?: boolean | null
          usaTransporte?: boolean | null
          usaUnitarioPedido?: boolean | null
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
